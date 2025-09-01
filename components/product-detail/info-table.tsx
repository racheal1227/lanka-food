import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface ProductDetailViewModel {
  origin: string
  weightGrams: number
  brand: string
  grade: string
  packageUnit: string
  ingredients: string
  shelfLife: string
  storage: string
  certifications: string
}

interface InfoTableProps {
  viewModel: ProductDetailViewModel
}

export default function InfoTable({ viewModel }: InfoTableProps) {
  const rows: { label: string; value: string }[] = [
    { label: '원산지', value: viewModel.origin || '정보 없음' },
    { label: '중량(g)', value: viewModel.weightGrams ? `${viewModel.weightGrams.toLocaleString()} g` : '정보 없음' },
    { label: '브랜드', value: viewModel.brand || '정보 없음' },
    { label: '등급', value: viewModel.grade || '정보 없음' },
    { label: '포장 단위', value: viewModel.packageUnit || '정보 없음' },
    { label: '성분', value: viewModel.ingredients || '정보 없음' },
    { label: '유통기한', value: viewModel.shelfLife || '정보 없음' },
    { label: '보관 방법', value: viewModel.storage || '정보 없음' },
    { label: '인증', value: viewModel.certifications || '정보 없음' },
  ]

  return (
    <Table>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className="w-32 align-top text-muted-foreground">{row.label}</TableCell>
            <TableCell className="align-top">{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
