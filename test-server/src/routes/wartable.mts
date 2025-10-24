import { Request, Response } from "express";

export async function wartable(req: Request, res: Response) {
    // const result: Partial<WarTableRow>[] = [
    //     { geekName: "Friendless", geek: 1234, owned: 300, totalPlays: 2034 },
    //     { geekName: "Bobby123", geek: 123, owned: 201, totalPlays: 48 },
    // ];
    // console.log(result);
    const resp = await fetch(`https://api.drfriendless.com/${req.url}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    res.send(await resp.json());
    res.status(200);
}