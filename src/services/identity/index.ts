export type AccountType = 'individual' | 'business';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type IdentityProfile = {
  accountType: AccountType;
  cpf?: string;
  cnpj?: string;
  verification: VerificationStatus;
};

/** Identity/KYC API boundary. Sensitive verification must be server-side. */
export async function verifyIdentity(profile: IdentityProfile) {
  return { ...profile, verification: 'pending' as const };
}
