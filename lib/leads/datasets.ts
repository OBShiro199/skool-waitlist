// The only two datasets. The client sends an id; the server maps it here. Nothing from the
// client ever becomes a collection or table name.
export type DatasetId = 'uk-eu' | 'us'

export const DATASETS: Record<DatasetId, { alias: string; table: string; hasMobiles: boolean; label: string }> = {
  'uk-eu': { alias: 'leads', table: 'data_list', hasMobiles: true, label: 'UK & EU' },
  us: { alias: 'us_leads', table: 'us_data_list', hasMobiles: false, label: 'US' },
}

export const isDataset = (v: unknown): v is DatasetId => v === 'uk-eu' || v === 'us'
