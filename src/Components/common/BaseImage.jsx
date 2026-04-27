/* eslint-disable react/prop-types */
import { resolveAssetPath } from "../../utils/ResolvePath";

const BaseImage = ({ src, alt = "", alignItems, justifyContent, flexDirection, gap, ...rest }) => {
  const resolvedSrc = resolveAssetPath(src);
  return <img src={resolvedSrc} alt={alt} {...rest} />;
};

export default BaseImage;
