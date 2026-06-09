import { IsEnum, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// Currencies that can be exchanged into coins.
export enum ExchangeFrom {
  POINTS = "points",
  STREAKS = "streaks",
}

export class ExchangeDto {
  @ApiProperty({
    description: "Which currency to convert into coins",
    enum: ExchangeFrom,
    example: ExchangeFrom.POINTS,
  })
  @IsEnum(ExchangeFrom)
  from: ExchangeFrom;

  @ApiProperty({
    description:
      "Amount of the source currency to spend. Must be a whole multiple of the exchange rate (100 points or 10 streaks per coin).",
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
