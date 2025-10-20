export interface module {
    id: number
    name: string
    label: string
    icon: string
    url: string
    is_active: number
    slug: string
    access: string[] | Array<{
		"name": string,
		"guard": string,
		"active": boolean,
	}>
    description: string
    deleted_at: string
    created_at: string
    created_by: string
    updated_at: string
    updated_by: string
}

  