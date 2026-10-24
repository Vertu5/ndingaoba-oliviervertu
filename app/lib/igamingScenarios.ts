import igamingData from "../data/igaming.json";

export interface LiveQueryResult {
  question: string;
  intentLabel: string;
  attempt1Sql: string;
  attempt1Error: string | null;
  finalSql: string | null;
  status: "ok" | "repaired" | "blocked";
  devTimeMs: number;
  prodTimeMs: number;
  columns: string[];
  rows: Record<string, string | number>[];
  chartKeyX?: string;
  chartKeyY?: string;
  chartLabelY?: string;
  businessTakeawayFr: string;
  businessTakeawayEn: string;
}

export function getIgamingScenarios(isEn: boolean): Record<string, LiveQueryResult> {
  const topMl = igamingData.top_ml_scores || [];
  const topPlayers = igamingData.top_players || [];

  return {
    vip_churn: {
      question: isEn
        ? "Which high-value players have the highest GGR at risk of churn?"
        : "Quels sont les gros joueurs avec le plus fort GGR à risque de départ (churn) ?",
      intentLabel: isEn ? "CRM Retention Target (MLflow Gold)" : "Ciblage Rétention CRM (MLflow Gold)",
      attempt1Sql:
        "SELECT player_id, country, cluster_persona, churn_probability, ggr, expected_ggr_at_risk FROM workspace.igaming.gold_player_ml_scores ORDER BY expected_ggr_at_risk DESC LIMIT 8",
      attempt1Error: null,
      finalSql:
        "SELECT player_id, country, cluster_persona, churn_probability, ggr, expected_ggr_at_risk FROM workspace.igaming.gold_player_ml_scores ORDER BY expected_ggr_at_risk DESC LIMIT 8",
      status: "ok",
      devTimeMs: 95,
      prodTimeMs: 280,
      columns: [
        "player_id",
        "country",
        "cluster_persona",
        "churn_probability",
        "ggr",
        "expected_ggr_at_risk",
      ],
      rows: topMl.slice(0, 8),
      chartKeyX: "player_id",
      chartKeyY: "expected_ggr_at_risk",
      chartLabelY: isEn ? "Expected GGR at Risk (€)" : "GGR à Risque Attendu (€)",
      businessTakeawayFr:
        "Décision CRM : Le joueur #2857 (Italie, VIP) génère 11 809 € de GGR avec 43,7 % de probabilité de départ (soit 5 155 € à risque). Un hôte VIP peut le relancer dès aujourd'hui avant qu'il ne quitte la plateforme.",
      businessTakeawayEn:
        "CRM Decision: Player #2857 (Italy, VIP) generates €11,809 GGR with a 43.7% churn probability (€5,155 at risk). A VIP host can trigger a tailored retention offer today before inactivity sets in.",
    },
    hallucination_repair: {
      question: isEn
        ? "What is the total revenue and profit per acquisition channel?"
        : "Quel est le chiffre d'affaires (revenue) et le profit par canal d'acquisition ?",
      intentLabel: isEn
        ? "Self-Correction: Hallucinated Column ('revenue' -> 'ggr')"
        : "Auto-Correction : Colonne Hallucinée ('revenue' -> 'ggr')",
      attempt1Sql:
        "SELECT acquisition_channel, SUM(revenue) AS total_revenue, AVG(profit) FROM gold_channel_performance GROUP BY acquisition_channel",
      attempt1Error:
        "Guardrail Shield 3 Rejected: Unknown column 'revenue' and 'profit'. Allowed revenue columns in gold_channel_performance: ['turnover', 'ggr', 'ggr_per_registered_player', 'ggr_per_active_player', 'hold_rate'].",
      finalSql:
        "SELECT acquisition_channel, registered_players, active_players, ggr, ggr_per_registered_player, hold_rate FROM workspace.igaming.gold_channel_performance ORDER BY ggr_per_registered_player DESC LIMIT 100",
      status: "repaired",
      devTimeMs: 110,
      prodTimeMs: 240,
      columns: [
        "acquisition_channel",
        "registered_players",
        "active_players",
        "ggr",
        "ggr_per_registered_player",
        "hold_rate",
      ],
      rows: igamingData.channels.rows,
      chartKeyX: "acquisition_channel",
      chartKeyY: "ggr_per_registered_player",
      chartLabelY: isEn ? "GGR / Registered Player (€)" : "GGR / Inscrit (€)",
      businessTakeawayFr:
        "Pourquoi ce bouclier est vital : Sans le Data Dictionary et la validation AST, le LLM invente la colonne 'revenue' et fait planter la requête. Ici, l'erreur est interceptée et corrigée automatiquement en 'ggr' en 0,3 seconde.",
      businessTakeawayEn:
        "Why this shield matters: Without the Data Dictionary and AST check, the LLM invents a 'revenue' column and crashes. Here, the error is caught and auto-repaired to 'ggr' in 0.3 seconds.",
    },
    top_vips: {
      question: isEn
        ? "Show the top 8 VIP players by Gross Gaming Revenue (GGR) and their bet volume"
        : "Montre le top 8 des joueurs VIP par revenu net (GGR) et leur volume de mises",
      intentLabel: isEn ? "VIP Whale Profiling" : "Profilage des Joueurs VIP",
      attempt1Sql:
        "SELECT player_id, country, acquisition_channel, segment, sessions, turnover, ggr FROM workspace.igaming.gold_player_stats WHERE spins > 0 ORDER BY ggr DESC LIMIT 8",
      attempt1Error: null,
      finalSql:
        "SELECT player_id, country, acquisition_channel, segment, sessions, turnover, ggr FROM workspace.igaming.gold_player_stats WHERE spins > 0 ORDER BY ggr DESC LIMIT 8",
      status: "ok",
      devTimeMs: 88,
      prodTimeMs: 215,
      columns: [
        "player_id",
        "country",
        "acquisition_channel",
        "segment",
        "sessions",
        "turnover",
        "ggr",
      ],
      rows: topPlayers.slice(0, 8),
      chartKeyX: "player_id",
      chartKeyY: "ggr",
      chartLabelY: "GGR (€)",
      businessTakeawayFr:
        "Insight VIP : Le joueur #5534 (acquis via Affiliate) a généré 45 867 € de GGR sur 393 082 € de mises en 97 sessions. Les 69 VIP représentent 1 % des joueurs mais 40,8 % des revenus du casino.",
      businessTakeawayEn:
        "VIP Insight: Player #5534 (Affiliate) generated €45,867 GGR on €393,082 in bets across 97 sessions. The 69 VIPs represent 1% of active players but 40.8% of total casino revenue.",
    },
    fraud_sessions: {
      question: isEn
        ? "Which fraud & responsible gaming flags appear most frequently across sessions?"
        : "Quels signaux de fraude et de jeu excessif apparaissent le plus souvent sur les sessions ?",
      intentLabel: isEn ? "Compliance & Anti-Fraud Audit" : "Audit Conformité & Anti-Fraude",
      attempt1Sql:
        "SELECT flag, sessions FROM workspace.igaming.gold_risk_sessions GROUP BY flag ORDER BY sessions DESC LIMIT 100",
      attempt1Error: null,
      finalSql:
        "SELECT flag, sessions FROM workspace.igaming.gold_risk_sessions GROUP BY flag ORDER BY sessions DESC LIMIT 100",
      status: "ok",
      devTimeMs: 102,
      prodTimeMs: 260,
      columns: ["flag", "sessions"],
      rows: igamingData.risk_flags.rows,
      chartKeyX: "flag",
      chartKeyY: "sessions",
      chartLabelY: isEn ? "Flagged Sessions" : "Sessions Signalées",
      businessTakeawayFr:
        "Décision Risque : Au lieu d'auditer 46 690 sessions à la main, le croisement des 6 drapeaux métier et d'Isolation Forest isole 10 sessions 'High Risk' et 67 anomalies confirmées en double alerte.",
      businessTakeawayEn:
        "Risk Decision: Instead of manually auditing 46,690 sessions, combining the 6 business flags with Isolation Forest isolates 10 'High Risk' sessions and 67 dual-confirmed anomalies.",
    },
    destructive_blocked: {
      question: isEn
        ? "DROP TABLE gold_player_stats; -- delete player records"
        : "DROP TABLE gold_player_stats; -- supprimer la table des joueurs",
      intentLabel: isEn ? "Security Attack Blocked (AST Shield)" : "Attaque Bloquée (Bouclier AST)",
      attempt1Sql: "DROP TABLE gold_player_stats",
      attempt1Error:
        "Guardrail Shield 3 CRITICAL BLOCK: Only read-only SELECT statements are permitted. Destructive or DDL statement 'Drop' was blocked before reaching Databricks.",
      finalSql: null,
      status: "blocked",
      devTimeMs: 0,
      prodTimeMs: 0,
      columns: [],
      rows: [],
      businessTakeawayFr:
        "Sécurité Garantie : Aucune requête générée par l'IA ne touche Databricks sans être analysée syntaxiquement par sqlglot. Toute commande DROP, DELETE, UPDATE ou accès hors de la couche Gold est bloquée en 0 ms.",
      businessTakeawayEn:
        "Guaranteed Safety: No AI-generated query ever reaches Databricks without being parsed into an AST by sqlglot. Any DROP, DELETE, UPDATE, or non-Gold table access is blocked in 0 ms.",
    },
  };
}

export function compileIgamingQuery(raw: string, isEn: boolean): LiveQueryResult {
  const lower = raw.toLowerCase();
  const scenarios = getIgamingScenarios(isEn);

  if (/\b(drop|delete|truncate|update|insert|alter|create|grant|revoke)\b/i.test(lower)) {
    return {
      question: raw,
      intentLabel: isEn ? "Blocked Destructive Command" : "Commande Destructrice Bloquée",
      attempt1Sql: raw,
      attempt1Error:
        "Guardrail Shield 3 CRITICAL BLOCK: Only read-only SELECT queries on Gold tables are allowed. Write/DDL operation rejected before reaching Databricks.",
      finalSql: null,
      status: "blocked",
      devTimeMs: 0,
      prodTimeMs: 0,
      columns: [],
      rows: [],
      businessTakeawayFr:
        "Le bouclier syntaxique sqlglot a bloqué cette instruction d'écriture/suppression instantanément avant tout appel à Databricks.",
      businessTakeawayEn:
        "The sqlglot AST shield blocked this write/destructive instruction instantaneously before any call to Databricks.",
    };
  }

  if (/\b(bronze_players|bronze_sessions|bronze_spins|silver_player_activity)\b/i.test(lower)) {
    return {
      question: raw,
      intentLabel: isEn ? "Blocked Raw Layer Access" : "Accès Couche Brute Bloqué",
      attempt1Sql: raw,
      attempt1Error:
        "Guardrail Shield 3 BLOCK: Table access denied. Text-to-SQL is restricted to governed Gold tables to prevent 4.65M-spin full table scans.",
      finalSql: null,
      status: "blocked",
      devTimeMs: 0,
      prodTimeMs: 0,
      columns: [],
      rows: [],
      businessTakeawayFr:
        "Pourquoi bloquer Bronze/Silver : Scanner 4,65 millions de spins bruts à chaque question coûterait cher et prendrait ~40 secondes. En forçant la couche Gold pré-agrégée, la réponse arrive en 0,2 seconde.",
      businessTakeawayEn:
        "Why block Bronze/Silver: Scanning 4.65M raw spins per question is slow and costly. Enforcing pre-aggregated Gold tables delivers answers in 0.2 seconds.",
    };
  }

  if (/\b(revenue|profit|chiffre|benefice|bénéfice|ca)\b/i.test(lower)) {
    return { ...scenarios.hallucination_repair, question: raw };
  }

  if (/\b(churn|depart|départ|quitter|inactif|ml|probabilit|cluster|persona|retent)\b/i.test(lower)) {
    return { ...scenarios.vip_churn, question: raw };
  }

  if (/\b(fraud|risque|risk|session|geo|ip|device|appareil|collusion|anomal)\b/i.test(lower)) {
    return { ...scenarios.fraud_sessions, question: raw };
  }

  if (/\b(canal|canaux|channel|marketing|acquisition|organic|affiliate|referral|hold)\b/i.test(lower)) {
    return {
      question: raw,
      intentLabel: isEn ? "Marketing Channel Query" : "Analyse Canal d'Acquisition",
      attempt1Sql:
        "SELECT acquisition_channel, registered_players, active_players, activation_rate, ggr, ggr_per_registered_player, hold_rate FROM workspace.igaming.gold_channel_performance ORDER BY ggr_per_registered_player DESC LIMIT 100",
      attempt1Error: null,
      finalSql:
        "SELECT acquisition_channel, registered_players, active_players, activation_rate, ggr, ggr_per_registered_player, hold_rate FROM workspace.igaming.gold_channel_performance ORDER BY ggr_per_registered_player DESC LIMIT 100",
      status: "ok",
      devTimeMs: 82,
      prodTimeMs: 195,
      columns: [
        "acquisition_channel",
        "registered_players",
        "active_players",
        "ggr",
        "ggr_per_registered_player",
        "hold_rate",
      ],
      rows: igamingData.channels.rows,
      chartKeyX: "acquisition_channel",
      chartKeyY: "ggr_per_registered_player",
      chartLabelY: isEn ? "GGR / Registered Player (€)" : "GGR / Inscrit (€)",
      businessTakeawayFr:
        "Décision Marketing : Organic génère 90,57 € par inscrit contre 41,72 € pour Referral, alors que le taux d'activation est identique (~85 %). Il faut réallouer le budget vers le SEO/Organic.",
      businessTakeawayEn:
        "Marketing Decision: Organic yields €90.57 per registered player vs €41.72 for Referral, while activation rates are identical (~85%). Reallocate budget toward SEO/Organic.",
    };
  }

  if (/\b(segment|rfm|pareto|dormant|loyal|champion)\b/i.test(lower)) {
    return {
      question: raw,
      intentLabel: isEn ? "RFM Segmentation Query" : "Segmentation Client RFM",
      attempt1Sql:
        "SELECT segment, players, turnover, ggr, share_of_ggr FROM workspace.igaming.gold_player_value ORDER BY ggr DESC LIMIT 100",
      attempt1Error: null,
      finalSql:
        "SELECT segment, players, turnover, ggr, share_of_ggr FROM workspace.igaming.gold_player_value ORDER BY ggr DESC LIMIT 100",
      status: "ok",
      devTimeMs: 90,
      prodTimeMs: 210,
      columns: ["segment", "players", "turnover", "ggr", "share_of_ggr"],
      rows: igamingData.segments.rows,
      chartKeyX: "segment",
      chartKeyY: "ggr",
      chartLabelY: "GGR (€)",
      businessTakeawayFr:
        "Insight RFM : 413 joueurs 'At risk (high value)' cumulent 553 778 € de mises mais décrochent. C'est le vivier n°1 de relance CRM.",
      businessTakeawayEn:
        "RFM Insight: 413 'At risk (high value)' players account for €553,778 in bets. They are the #1 CRM reactivation target.",
    };
  }

  return { ...scenarios.top_vips, question: raw };
}
