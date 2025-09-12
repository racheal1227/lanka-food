import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import type { ProductAttribute } from '@/types/database.models'

interface AttributesTableProps {
  attributes: ProductAttribute[]
}

export default function AttributesTable({ attributes }: AttributesTableProps) {
  const rows = [...(attributes || [])].sort((a, b) => a.order - b.order)

  if (!rows.length) {
    return <div className="text-sm text-muted-foreground">등록된 상품 정보가 없습니다.</div>
  }

  return (
    <Table>
      <TableBody>
        {rows.map((attr) => (
          <TableRow key={`${attr.order}-${attr.key}`}>
            <TableCell className="w-32 align-top text-muted-foreground">{attr.key}</TableCell>
            <TableCell className="align-top whitespace-pre-line">{attr.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
