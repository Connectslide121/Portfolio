You are an expert .NET 8 and Azure Functions architect. Help me set up the backend for a new SaaS web app.

### Project overview

I’m building an AI-powered lesson-planning platform for teachers in Sweden. The backend is an HTTP API that:

- Authenticates users via Azure AD B2C (JWT access tokens).
- Stores lesson plans, user data, and AI-related content in Cosmos DB.
- Uses Cosmos DB’s vector search to retrieve semantically similar content.
- Calls Azure AI / Azure OpenAI (via Azure AI Foundry) to:
  - Generate embeddings.
  - Generate or refine lesson plans using RAG (retrieved context + teacher prompt).

The frontend is an Angular SPA using MSAL to get B2C tokens and call this API.

### Tech stack

- Runtime: Azure Functions, .NET 8 **isolated** process.
- HTTP API only (no triggers other than HTTP and maybe timers later).
- Data: Azure Cosmos DB (Core/SQL API) with vector search enabled.
- AI: Azure AI OpenAI via the `Azure.AI.OpenAI` SDK.
- Auth: Azure AD B2C / Entra External ID, validating JWTs issued to the SPA.
- Config & Secrets: environment variables + Azure Key Vault (later).
- Logging: Application Insights via standard .NET logging abstractions.

### High-level backend architecture

I want a clean separation of concerns inside a single solution, something like this:

- `src/Api/` – Azure Functions project (HTTP endpoints only)
  - `Program.cs` – host configuration, DI, middleware.
  - `Functions/` – classes for HTTP endpoints (e.g. `LessonFunctions`, `ResourceFunctions`, `AiFunctions`).
- `src/Application/` – core application logic:
  - Services:
    - `LessonPlanService`
    - `ResourceService`
    - `EmbeddingService`
    - `AiGenerationService` (calls Azure OpenAI)
  - DTOs and use case handlers.
- `src/Domain/` – domain models (POCOs) and enums:
  - `LessonPlan`, `LessonSection`, `Resource`, `EmbeddingChunk`, `User`, etc.
- `src/Infrastructure/` – external integrations:
  - Cosmos DB repositories:
    - `LessonRepository`
    - `ResourceRepository`
    - `EmbeddingRepository`
  - `CosmosClientFactory` for configuring Cosmos.
  - AI client wrapper: `OpenAiClient` that wraps `Azure.AI.OpenAI` calls.
  - B2C-related helpers (e.g. extracting claims from token if needed, though the main validation should happen at the API layer).

Dependency direction:
- `Api` depends on `Application` and `Infrastructure`.
- `Application` depends on `Domain` and interfaces defined in `Application`.
- `Infrastructure` implements interfaces from `Application`.

### Data model sketch

This is a rough idea; you can propose better names if needed:

- `LessonPlan`:
  - `id`
  - `organizationId`
  - `ownerUserId`
  - `title`
  - `subject`
  - `grade`
  - `language`
  - `objectives` (text)
  - `sections` (collection of lesson sections)
  - `createdAt`, `updatedAt`
- `Resource`:
  - `id`
  - `organizationId`
  - `ownerUserId`
  - `name`
  - `blobUrl` or `storagePath`
  - `type` (pdf, doc, text, etc.)
- `EmbeddingChunk`:
  - `id`
  - `organizationId`
  - `ownerUserId`
  - `sourceId` (links to `LessonPlan` or `Resource` or “curriculum”)
  - `sourceType` (`Lesson`, `Resource`, `Curriculum`, etc.)
  - `text` (chunk)
  - `embedding` (vector field)
  - `subject`, `grade`, `language`
  - `createdAt`

We’ll use `organizationId` as the partition key for multitenancy.

### Auth & security

- Validate JWT access tokens issued by Azure AD B2C:
  - Use the tenant’s `b2clogin.com` authority and the specific policy.
  - Validate audience (API app registration).
- Extract basic claims:
  - `sub` (user id)
  - `emails` or `preferred_username`
  - A custom claim like `extension_organizationId` later on.
- Enforce that all data access is filtered by `organizationId` from the token.

I am fine with explicit JWT validation in the Functions isolated host (no Easy Auth). Use the standard `Microsoft.IdentityModel.Tokens` JWT validation approach.

### AI integration

- Use `Azure.AI.OpenAI` with a configuration-driven setup:
  - Endpoint + API key from configuration.
  - Choose an embedding model (e.g. `text-embedding-3-large`) and a GPT-4.x chat/completions model.
- `EmbeddingService`:
  - Takes raw text, chunks it, calls OpenAI embeddings API, and stores `EmbeddingChunk` documents in Cosmos.
- `AiGenerationService`:
  - Given:
    - the teacher’s prompt,
    - some structured request (subject, grade, language),
  - Performs:
    - vector search against `EmbeddingChunk` in Cosmos to retrieve relevant chunks,
    - builds a prompt with those chunks,
    - calls GPT to generate a lesson plan (or part of it),
    - returns structured data to the frontend.

For now, keep prompts and logic simple; we can refine later.

### What I want you to do now

1. Propose a .NET 8 solution layout (`.sln` and project structure`) matching the architecture above.
2. Show the `dotnet` CLI commands to:
   - Create the solution.
   - Create the Functions project (isolated process).
   - Create the Application, Domain, and Infrastructure class library projects.
   - Add project references in the correct direction.
3. In the `Api` (Functions) project:
   - Set up `Program.cs` for an isolated Functions host with:
     - Dependency injection for:
       - `LessonPlanService`
       - `EmbeddingService`
       - `AiGenerationService`
       - Cosmos repositories
       - OpenAI client wrapper
     - JWT bearer validation for Azure AD B2C (with placeholder config values).
   - Create a sample HTTP-triggered function:
     - `POST /api/lesson-plans/generate`
     - Requires a valid JWT.
     - Accepts a JSON body with prompt + subject + grade.
     - Calls `AiGenerationService` and returns a dummy result for now.
4. In the `Infrastructure` project:
   - Sketch a `CosmosLessonRepository` that uses `Azure.Cosmos` with a vector-enabled container (assume an `embedding` field on `EmbeddingChunk`).
   - Provide a sample query method that:
     - Takes an embedding and metadata (subject, grade, organizationId),
     - Performs a vector similarity search with filters.

Use clean C# 12, async/await, and DI patterns that are idiomatic for .NET 8 isolated Azure Functions. You don’t need to fully implement everything; focus on scaffolding the architecture and showing clear patterns that I can extend.
