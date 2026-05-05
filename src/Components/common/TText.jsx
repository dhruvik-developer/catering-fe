/* eslint-disable react/prop-types */
import { useTranslated } from "../../hooks/useTranslated";

/**
 * Render a plain string translated into the user's active language.
 *
 * Use for API-derived text:
 *   <TText>{category.name}</TText>
 *   <TText>{item.name}</TText>
 *
 * For static UI copy, keep using `t("key")` from react-i18next.
 */
export default function TText({ children, sourceLang = "en" }) {
  const text = typeof children === "string" ? children : "";
  const translated = useTranslated(text, sourceLang);
  return <>{translated}</>;
}
