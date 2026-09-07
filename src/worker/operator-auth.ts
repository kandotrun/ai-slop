import { normalizeLoginEmail, type UserSessionUser } from "./user-auth";

type OperatorConfig = Pick<Env, "OPERATOR_EMAILS" | "OPS_INTERNAL_EMAILS">;

export function configuredEmails(value: string | undefined): string[] {
  return [...new Set((value ?? "").split(",").map(normalizeLoginEmail).filter((email): email is string => email !== null))];
}

export function isOperator(user: UserSessionUser, env: OperatorConfig): boolean {
  const email = normalizeLoginEmail(user.email);
  return user.emailVerified === true && email !== null && configuredEmails(env.OPERATOR_EMAILS).includes(email);
}

export function operatorAuthUser(user: UserSessionUser, env: OperatorConfig) {
  return { id: user.id, email: user.email, name: user.name, image: user.image ?? null, isOperator: isOperator(user, env) };
}
