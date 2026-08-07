"""Security helper tests."""

from shaadigen.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hash_roundtrip() -> None:
    hashed = hash_password("wedding-secret")
    assert hashed != "wedding-secret"
    assert verify_password("wedding-secret", hashed)
    assert not verify_password("wrong", hashed)


def test_jwt_roundtrip() -> None:
    token = create_access_token("user-123", extra_claims={"role": "couple"})
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "user-123"
    assert payload["role"] == "couple"


def test_jwt_invalid_token() -> None:
    assert decode_access_token("not.a.token") is None
