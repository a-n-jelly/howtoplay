import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: "Game name is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a board game expert. Given a board game name, generate a comprehensive game guide using the generate_game_guide tool. Include accurate setup steps, learning steps, quick rules, turn phases, actions, rule snippets, tips for beginners and advanced players, first play walkthrough steps, and any known expansions. Be thorough and accurate.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a complete game guide for: "${name}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_game_guide",
              description: "Generate a complete board game guide with all sections",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Official game name" },
                  description: { type: "string", description: "Brief description of the game (1-2 sentences)" },
                  playerCount: { type: "string", description: "Player count range, e.g. '2-4'" },
                  playTime: { type: "string", description: "Play time range, e.g. '60-90 min'" },
                  complexity: { type: "string", enum: ["low", "medium", "high"] },
                  category: { type: "string", description: "Game category, e.g. 'Strategy', 'Party', 'Cooperative'" },
                  setupSteps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        stepNumber: { type: "number" },
                        instruction: { type: "string" },
                      },
                      required: ["stepNumber", "instruction"],
                    },
                  },
                  learnSteps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        tips: { type: "array", items: { type: "string" } },
                      },
                      required: ["title", "content"],
                    },
                    description: "5 learning steps: Goal, Setup, Turns, Actions, Scoring",
                  },
                  quickRules: {
                    type: "object",
                    properties: {
                      turnOrder: { type: "array", items: { type: "string" } },
                      actions: { type: "array", items: { type: "string" } },
                      scoring: { type: "array", items: { type: "string" } },
                      edgeCases: { type: "array", items: { type: "string" } },
                    },
                    required: ["turnOrder", "actions", "scoring", "edgeCases"],
                  },
                  turnPhases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        actions: { type: "array", items: { type: "string" } },
                      },
                      required: ["name", "description", "actions"],
                    },
                  },
                  actions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        cost: { type: "string" },
                        example: { type: "string" },
                      },
                      required: ["name", "description"],
                    },
                  },
                  ruleSnippets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        text: { type: "string" },
                        example: { type: "string" },
                      },
                      required: ["category", "text"],
                    },
                  },
                  tips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        isBeginner: { type: "boolean" },
                      },
                      required: ["text", "isBeginner"],
                    },
                  },
                  firstPlaySteps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phase: { type: "string" },
                        instruction: { type: "string" },
                        hint: { type: "string" },
                      },
                      required: ["phase", "instruction"],
                    },
                  },
                  expansions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        playerCount: { type: "string" },
                        description: { type: "string" },
                        setupModifications: { type: "array", items: { type: "string" } },
                        extraRules: { type: "array", items: { type: "string" } },
                        extraActions: { type: "array", items: { type: "string" } },
                      },
                      required: ["id", "name", "playerCount", "description", "setupModifications", "extraRules", "extraActions"],
                    },
                  },
                },
                required: ["name", "description", "playerCount", "playTime", "complexity", "category", "setupSteps", "learnSteps", "quickRules", "turnPhases", "actions", "ruleSnippets", "tips", "firstPlaySteps", "expansions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_game_guide" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return structured data" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gameData = typeof toolCall.function.arguments === "string"
      ? JSON.parse(toolCall.function.arguments)
      : toolCall.function.arguments;

    return new Response(JSON.stringify(gameData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-game error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
