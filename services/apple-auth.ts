type AppleFullName = { givenName?: string | null } | null | undefined;

export function getDisplayName(fullName: AppleFullName): string {
  return fullName?.givenName?.trim() || 'usuário';
}

export function getAppleSignInErrorMessage(error: unknown): string | null {
  const code = (error as { code?: unknown } | null)?.code;

  if (code === 'ERR_CANCELED') {
    return null;
  }

  return 'Não foi possível entrar com a Apple. Tente novamente.';
}
