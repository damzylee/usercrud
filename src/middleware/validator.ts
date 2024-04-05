import { Request, Response } from 'express';
import {
	MatchedDataOptions,
	matchedData,
	validationResult,
} from 'express-validator';

declare global {
	namespace Express {
		interface Request {
			validated: (
				options?: Partial<MatchedDataOptions>
			) => Record<string, any> | any;
		}
	}
}

const Validator = (validations: Array<any>) => {
	return async (req: Request, res: Response, next: any) => {
		for (let validation of validations) {
			await validation.run(req);
		}

		const result = validationResult(req);
		if (req.header('x-precognition')) {
			const data = result.array().map((error: any) => {
				if (error.param === 'email') {
					return error;
				}

				return null;
			});
			data.filter((error: any) => error !== null);

			return res.status(200).json({
				status: true,
				message: 'Validation successful.',
			});
		}

		if (result.isEmpty()) {
			req.validated = (options?: Partial<MatchedDataOptions>) => {
				return matchedData(req, options);
			};
			return next();
		}

		return res.status(422).json({
			status: false,
			message: 'Validation error.',
			errors: result.array(),
		});
	};
};

export default Validator;
