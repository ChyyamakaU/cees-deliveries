/** Consistent max-width + horizontal padding for page sections. */
export default function Container({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`mx-auto w-full max-w-[100rem] px-[55px] ${className}`}>{children}</Tag>;
}
