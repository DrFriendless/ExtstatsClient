import { Request, Response } from "express";

/**
 *
 * @param {} req
 * @param {} res
 */
export const findgeeks = async (req: Request, res: Response) => {
    const name = req.params["fragment"].toLowerCase().replace(/%/g, "");
    console.log(`findgeeks ${name}`);
    const matches = ["Friendless"];
    res.send(matches);
};
