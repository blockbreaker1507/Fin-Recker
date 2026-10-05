# Agentic AI - Financial Reconciliation: Capabilities

**Pilot approach and capabilities**, as listed in the deck.

## Flow at a glance

```
Source & Data  ->  Staging Database  ->  Processing Capabilities  ->  Human in the Loop  ->  Output
                                                  ^                          |
                                                  +---- Feedback in the Loop-+
```

---

## 1. Source and Data

| Pilot | Source | Scope |
|-------|--------|-------|
| Pilot 1 | IRIS | 10 accounts |
| Pilot 2 | Grassroot use cases | 3 use cases |

Both pilots feed into a **Staging Database**, which is the input to the processing capabilities.

---

## 2. Processing Capabilities

### 2.1 Data Context
*Defines business context.*

**Data Context Engine**

| Component | Description |
|-----------|-------------|
| Data Classification | Categorize the type of transactions |
| Context Enrichment | Gather related policies / reference data |

### 2.2 Fuzzy Matching
*Multi-parameter matching.*

**Fuzzy Matching Engine**

| Component | Description |
|-----------|-------------|
| Data Normalization | Standardize data, dates and amounts |
| Multi-Param Matching | Match on description, reference and JE date |
| Confidence Threshold | Fuzzy match vs. escalate decision |
| Candidate Ranking | Best-fit match proposed to reviewer |

### 2.3 Document Intelligence
*Extract data from SOP / supporting documents into a structured format for reconciliations.*

**Document Intelligence Engine**

| Component | Description |
|-----------|-------------|
| Document Classification | Identifies each document type |
| Data Extraction and Normalization | Extracts details from various documents |

### 2.4 Investigation
*Performs analyst-like research.*

**Investigation Engine**

| Component | Description |
|-----------|-------------|
| Document Intelligence Output | RAG + vector search over case context |
| Semantic Search | RAG + vector search over case context |
| Match Scoring | LLM reasoning on gaps and candidates |
| Candidate Ranking | Best-fit match proposed to reviewer |

**SOR Connectors** *(Aspirational goal)*

| Connector | Status |
|-----------|--------|
| Lumi | Aspirational |
| Sub-ledger | Aspirational |
| AP / AR | Aspirational |
| + New SOR | Aspirational, extensible to further systems of record |

---

## 3. Human in the Loop

### 3.1 UI - Human Review
Every AI match is approved or rejected by a reviewer.

### 3.2 Notification
Send alerts on email / Slack to the reviewer and process experts.

### 3.3 Feedback in the Loop
Every match pattern and reason is stored. The capability's recommendations are then made as per previous feedback. This feeds back into the processing capabilities.

---

## 4. Output

- Reconciled Report
- Governance and Audit Trail
- Decision Logs
- Reject-reason Logs

---

## Summary checklist

- [ ] Staging Database ingesting Pilot 1 (IRIS, 10 accounts) and Pilot 2 (Grassroot, 3 use cases)
- [ ] Data Context Engine: Data Classification, Context Enrichment
- [ ] Fuzzy Matching Engine: Data Normalization, Multi-Param Matching, Confidence Threshold, Candidate Ranking
- [ ] Document Intelligence Engine: Document Classification, Data Extraction and Normalization
- [ ] Investigation Engine: Document Intelligence Output, Semantic Search, Match Scoring, Candidate Ranking
- [ ] SOR Connectors (aspirational): Lumi, Sub-ledger, AP / AR, new SORs
- [ ] UI - Human Review (approve / reject every AI match)
- [ ] Notification (email / Slack)
- [ ] Feedback in the Loop (store match patterns and reasons, reuse them in future recommendations)
- [ ] Outputs: Reconciled Report, Governance and Audit Trail, Decision Logs, Reject-reason Logs
