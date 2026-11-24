import { IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;
}