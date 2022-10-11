import {IncomingHttpHeaders} from "http";

export interface TypedRequestBody<T> extends Express.Request {
    body: T,
    headers: IncomingHttpHeaders & {
        accesstoken?: String
    }
}
