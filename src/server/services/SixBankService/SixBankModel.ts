/**
 * @deprecated use -> npm i  @wisegar-org/wgo-databank
 */
export interface ISixBankModel {
  /**
   * @description: The banks/financial institutions are divided into so-called bank groups. At present these are made up of the following:\n01 = Swiss National Bank\n02 = UBS Group\n03 = Reserve\n04 = Credit Suisse Group\n05 = Credit Suisse Group\n06 = Entris Banks\n07 = Cantonal Banks\n08 = Raiffeisen Banks and individual institutions\n09 = PostFinance\n
   */
  group: string;
  /**
   * @description: Each bank/financial institution is identified by way of an IID (institution identification) made up of 3 to 5 digits.
   */
  iid: number;
  /**
   * @description: Together with the IID the branch ID provides a conclusive key for each entry. Each IID has a main branch with the branch ID \"0000\"; the branch IDs from \"0001\" are assigned to this IID.
   */
  branchId: string;
  /**
   * @description: If this field contains a number, the IID is no longer valid (e.g. due to a merger) and is to be replaced by the \"New IID\" (so-called concatenation). A concatenation is always carried out with the branch ID \"0000\" of the new IID. All other record fields and the original information remain unchanged until the cancellation of the concatenation.
   */
  newIid: number;
  /**
   * @description: This is always a 6-digit number and may be used only by SIC and euroSIC participants.
   */
  sicIid: string;
  /**
   * @description: IID of the head office (headquarters)
   */
  headOffice: number;
  /**
   * @description: Provides information as to the respective type of entry.
   *  "enum" : [ "HEADQUARTERS", "MAIN_BRANCH", "BRANCH" ]
   */
  iidType: string;
  /**
   * @description: Date (according to ISO 8601) from which the information in a record is valid. The date is adjusted as soon as an amendment has been made in one or several fields or in the case of a record which is for the first time included in the file.
   */
  validSince: string;
  /**
   * @description: This code provides information regarding participation in the services SIC and LSV+/BDD in CHF.\nNO_PARTICIPATION: no participation in SIC\nSIC_PARTICIPATION_AND_LSV_AS_DEBTOR_FI: participation in SIC and in LSV+/BDD as DEB-FI. Direct debits in CHF debitable to an IID not indicated with this code will be rejected (DEB-FI = direct debit payers financial institution).\nSIC_PARTICIPATION: participation in SIC\nSIC_PARTICIPATION_WITH_QR_IID: participation in SIC with QR-IID for payments with QR reference\n
   */
  sicParticipation: string;
  /**
   * @description: This code provides information regarding participation in the services euroSIC and LSV+/BDD in EUR:\nNO_PARTICIPATION: no participation in euroSIC\nEURO_SIC_PARTICIPATION_AND_LSV_AS_DEBTOR_FI: participation in euroSIC and in LSV+/BDD as DEB-FI. Direct debits in EUR debitable to an IID not indicated with this code will be rejected (DEB-FI = direct debit payers financial institution).\nEURO_SIC_PARTICIPATION: participation in euroSIC\nEURO_SIC_PARTICIPATION_WITH_QR_IID: participation in euroSIC with QR-IID for payments with QR reference\n
   */
  euroSicParticipation: string;
  /**
   * @description: The fields entitled \"shortName\" and \"BankOrInstitutionName\" for each record are supplied in the respective languages. DE = German, FR = French, IT = Italian
   */
  language: string;
  /**
   * @description: Short name of the bank or financial institution
   */
  shortName: string;
  /**
   * @description: Name of the bank or financial institution\nNotice:\n+ in the first position  of  the name of the bank/institution = in liquidation\n++ in the first position  of  the name of the bank/institution = alternation of purpose\n
   */
  bankOrInstitutionName: string;
  /**
   * @description: Address of domicile
   */
  domicileAddress: string;
  /**
   * @description: Postal address
   */
  postalAddress: string;
  /**
   * @description: Postal/Zip code
   */
  zipCode: string;
  /**
   * @description: Place
   */
  place: string;
  /**
   * @description: Phone number. Formatted representation (with blanks)
   */
  phone: string;
  /**
   * @description: Fax number. Formatted representation (with blanks)
   */
  fax: string;
  /**
   * @description: International dialling code for telephone and fax (foreign entries only)
   */
  diallingCode: string;
  /**
   * @description: 2-digit alphabetical country code according to the ISO standard 3166 (foreign entries only)
   */
  countryCode: string;
  /**
   * @description: Postal account number.\nA * in the first position points out that the listed postal account number is part of a higher-level\nIID (e.g. main branch).\n
   */
  postalAccount: string;
  /**
   * @description: BIC of the bank or financial institution. \nFormated representation (XXXXXXXXXXX) (= 11 characters).\n(The SWIFT/BIC addresses used in this directory are the property of SWIFT SCRL,\n1310 La Hulpe / Belgium and have been made available by SIX Interbank Clearing Ltd\non behalf of the bank or financial institution.)\n
   */
  bic: string;
}
