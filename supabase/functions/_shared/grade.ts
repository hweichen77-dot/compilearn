export type Rules = {
  mustInclude?: string[];
  mustExclude?: string[];
  includeAny?: string[];
};

export function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[‘’ʼ′]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―]/g, "-");
}

export function gradeOutput(output: unknown, rules: Rules = {}): { pass: boolean; reasons: string[] } {
  const text = normalize(output);
  const reasons: string[] = [];
  let pass = true;

  for (const term of rules.mustInclude || []) {
    if (!text.includes(normalize(term))) {
      pass = false;
      reasons.push(`missing “${term}”`);
    }
  }
  for (const term of rules.mustExclude || []) {
    if (text.includes(normalize(term))) {
      pass = false;
      reasons.push(`should not contain “${term}”`);
    }
  }
  if (rules.includeAny && rules.includeAny.length) {
    const hit = rules.includeAny.some((t) => text.includes(normalize(t)));
    if (!hit) {
      pass = false;
      reasons.push(`expected one of: ${rules.includeAny.join(", ")}`);
    }
  }
  return { pass, reasons };
}
