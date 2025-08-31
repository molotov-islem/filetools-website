import Script from "next/script"

interface StructuredDataProps {
  data: any
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface BreadcrumbsProps {
  items: Array<{ name: string; href: string }>
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {index === items.length - 1 ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a href={item.href} className="hover:text-foreground transition-colors" itemProp="item">
                <span itemProp="name">{item.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
