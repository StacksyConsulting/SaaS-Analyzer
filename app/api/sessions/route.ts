import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionToken = randomBytes(32).toString("hex")

    const { data, error } = await supabase
      .from("user_sessions")
      .insert([
        {
          session_token: sessionToken,
          device_info: body.device_info || {},
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        session_token: sessionToken,
        session_id: data[0].id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionToken = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token required" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("user_sessions")
      .update({
        last_active: new Date().toISOString(),
        device_info: body.device_info,
      })
      .eq("session_token", sessionToken)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data[0] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
