export class BrowserInfoDto {
  colorDepth?: number;
  userAgent?: string;
  language?: string;
  timeZone?: string;
  screenWidth?: number;
  javaEnabled?: boolean;
  customerIp?: string;
  screenHeight?: number;
  windowHeight?: number;
  timeZoneOffset?: number;
  windowWidth?: number;
}

export class CardDataDto {
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiryDate?: string;
  cardExpiryDate2?: string;
  cardCvv?: string;
  browser?: BrowserInfoDto;
}

export class BillingDto {
  firstName?: string;
  lastName?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  externalUserId?: string;
  dateOfBirth?: string;
}

export class CreateTransactionDto {
  amount?: number;
  currency?: string;
  lang?: string;
  billing?: BillingDto;
  orderId?: string;
  cardToken?: string;
  payment3dsType?: string;
  kycVerified?: boolean;
  previousPaymentCount?: number;
  cardData?: CardDataDto;
  saveCard?: boolean;
}
