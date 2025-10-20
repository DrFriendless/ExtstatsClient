import { Request, Response } from "express";
import {FAQCount} from "extstats-core";

const NUMBERS = [0, 0, 0, 0, 0, 0, 0];

export async function faqcount(req: Request, res: Response) {
    if (req.body) {
        for (const i of req.body) {
            NUMBERS[i - 1] += 1;
        }
    }
    const result: FAQCount[] = NUMBERS.map(n => {
        return {
            ever: n,
            day: Math.ceil(n / 2),
            week: Math.floor(n / 3),
            month: Math.floor(n / 4),
            year: Math.floor(n / 5)
        }
    });
    console.log(result);
    res.send(result);
    res.status(200);
}