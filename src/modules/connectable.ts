import ConnectableDoc from '@database/docs/Connectable.doc';
import Connectable from '@database/models/Connectable.model';
import {sendError} from '@modules/error';
import {getSessionConnectableId, sign} from '@modules/jwt';
import * as EmailValidator from 'email-validator';
import {NextFunction, Request, Response} from 'express';

const createError = require('http-errors');

const expIn = '24h';

/**
 * Verify the authorisation to connect
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @return response with user's data if connection allowed, error if not
 */
export async function connect(req: Request, res: Response, next: NextFunction) {
	const body = req.body;
	if (!body) return next(createError(422, 'body missing'));
	if (!body.email || !EmailValidator.validate(body.email))
		return next(createError(422, "field 'email' missing or invalid"));
	if (!body.password)
		return next(createError(422, "field 'password' missing"));

	try {
		const connectable: ConnectableDoc = await Connectable.getByMail(
			body.email
		);
		if (!connectable || !connectable.verifyPassword(body.password))
			return next(
				createError(401, "field 'email' or 'password' incorrect")
			);
		res.json({
			token: generateSessionToken(connectable._id),
			type: connectable.institution_name ? 'institution' : 'doctor',
		});
	} catch (e) {
		console.log(e);
		sendError(next);
	}
}

/**
 *
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @param connectable the connectable that asked to connect
 * @param paramsErrorMsg the error message to send if error is due to the params
 */
export async function register(
	req: Request,
	res: Response,
	next: NextFunction,
	connectable: ConnectableDoc,
	paramsErrorMsg: string
) {
	try {
		connectable = await Connectable.save(connectable);
		res.status(201).json({
			token: generateSessionToken(connectable._id),
			type: connectable.institution_name ? 'institution' : 'doctor',
		});
	} catch (e) {
		console.log(e);
		if (e.code === 11000) return next(createError(409, paramsErrorMsg));
		sendError(next);
	}
}

/**
 * Verify if a session is provided and if it's valid
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @return response delegated to the next middleware, or with an error
 */
export function verifySession(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!req.headers.authorization)
		return next(createError(401, "no header 'Authorization' provided"));

	const [bearer, token] = req.headers.authorization.split(' ');
	if (bearer !== 'Bearer')
		return next(createError(401, "header 'Authorization' invalid"));
	const session: string = <string>token;
	try {
		res.locals.session = <string[]>(
			(<unknown>getSessionConnectableId(session))
		);
		next();
	} catch (e) {
		return next(
			createError(401, "header 'Authorization' invalid or expired")
		);
	}
}

/**
 * Generate a session token
 * @param id the id
 * @param exp the expiration time
 * @private
 */
export function generateSessionToken(id: string, exp: string = expIn): string {
	return sign(
		{
			id,
		},
		exp ? {expiresIn: exp} : {}
	);
}
