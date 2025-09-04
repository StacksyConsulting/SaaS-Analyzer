import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getAccessTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader) return null
  const token = authHeader.replace("Bearer ", "")
  return token || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getAccessTokenFromRequest(request)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  supabase.auth.setAuth(token)

  try {
    const { data, error } = await supabase
      .from("contract_analyses")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    if (!data) return NextResponse.json({ error: "Analysis not found" }, { status: 404 })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getAccessTokenFromRequest(request)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

  supabase.auth.setAuth(token)

  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from("contract_analyses")
      .update({
        contracts: body.contracts,
        total_savings: body.total_savings,
        total_spend: body.total_spend,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data: data?.[0] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getAccessTokenFromRequest(request)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  supabase.auth.setAuth(token)

  try {
    const { error } = await supabase
      .from("contract_analyses")
      .delete()
      .eq("id", params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ message: "Analysis deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
