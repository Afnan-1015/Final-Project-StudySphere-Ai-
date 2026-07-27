import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }) {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
}
