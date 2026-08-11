import type { Category, CategoryKind } from '../../types/models.ts'

interface CategorySelectProps {
  categories: Category[]
  kind: CategoryKind
  value: string
  onChange: (categoryId: string) => void
  id?: string
}

export function CategorySelect({ categories, kind, value, onChange, id }: CategorySelectProps) {
  const options = categories.filter((c) => c.kind === kind && !c.archived)
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((c) => (
        <option key={c.id} value={c.id}>
          {c.icon ? `${c.icon} ` : ''}
          {c.name}
        </option>
      ))}
    </select>
  )
}
