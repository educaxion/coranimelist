import { IsIn } from "class-validator";

export class updateWatchlistStatusDto {
    @IsIn([
        'WATCHING',
        'COMPLETED',
        'PLANNING',
        'PAUSED',
        'DROPPED',
    ])
    status: 
    | 'WATCHING'
    | 'COMPLETED'
    | 'PLANNING'
    | 'PAUSED'
    | 'DROPPED'
}