import test from "node:test";
import assert from "node:assert/strict";
import { isDisposableEmail, emailDomain } from "../../supabase/functions/_shared/disposableEmail.ts";

test("flags known disposable providers", () => {
  for (const e of ["a@mailinator.com", "b@YOPmail.com", "c@guerrillamail.net", "d@sharklasers.com"]) {
    assert.equal(isDisposableEmail(e), true, e);
  }
});

test("flags subdomains of disposable providers", () => {
  assert.equal(isDisposableEmail("a@inbox.mailinator.com"), true);
});

test("allows real providers and custom domains", () => {
  for (const e of ["jason@gmail.com", "a@outlook.com", "a@compilearn.com", "a@stanford.edu", "a@mail.google.com"]) {
    assert.equal(isDisposableEmail(e), false, e);
  }
});

test("handles malformed input without throwing", () => {
  assert.equal(isDisposableEmail(""), false);
  assert.equal(isDisposableEmail("no-at-sign"), false);
  assert.equal(emailDomain("a@b@mailinator.com"), "mailinator.com");
});
