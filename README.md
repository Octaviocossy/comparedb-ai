# CompareDB AI

An AI-powered database schema synchronization tool that compares two SQL Server schemas and generates comprehensive migration scripts. Built for local development and database administration tasks.

## 🚀 Features

- **AI-Powered Schema Comparison**: Uses OpenAI to intelligently compare database schemas
- **Comprehensive Migration Scripts**: Generates idempotent SQL scripts with proper transaction safety
- **Complete Object Coverage**: Handles tables, columns, indexes, views, stored procedures, functions, triggers, and seed data
- **Logical Operation Order**: Creates, alters, and drops objects in the correct dependency order
- **Clipboard Integration**: Easy copy-to-clipboard functionality for generated scripts
- **Modern UI**: Clean, responsive interface with dark mode support
- **Local Development**: Designed to run locally for security and privacy

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4, shadcn/ui components
- **AI Integration**: OpenAI API with Vercel AI SDK
- **Development**: ESLint, Prettier, Turbopack

## 🏗️ How It Works

1. **Input**: Paste your source schema (truth) and target schema (current state)
2. **AI Processing**: The tool analyzes both schemas using sophisticated AI prompts
3. **Script Generation**: Generates a complete `sync_schema.sql` migration script
4. **Copy to Clipboard**: Use the copy button to copy the generated script to your clipboard
5. **Safe Execution**: Scripts include existence checks and transaction wrapping

### Migration Script Features

- **DROP** obsolete objects (constraints, indexes, views, SPs, functions, triggers)
- **CREATE/ALTER** tables and columns
- **CREATE/ALTER** constraints (PK, FK, CHECK)
- **CREATE/ALTER** indexes
- **CREATE/ALTER** views, stored procedures, functions, triggers
- **INSERT/UPDATE** seed data

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd comparedb-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

1. **Paste Source Schema**: Add your reference/target database schema in the "Source" panel
2. **Paste Target Schema**: Add your current database schema in the "Target" panel  
3. **Generate Migration**: Click "Merge" to generate the synchronization script
4. **Copy & Execute**: Use the copy button to copy the generated `sync_schema.sql` script to your clipboard, then paste it into your SQL editor and run it on your database

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🛡️ Safety Features

- **Existence Checks**: Every operation includes proper existence validation
- **Transaction Wrapping**: All changes wrapped in TRY/CATCH transactions
- **Idempotent Scripts**: Safe to run multiple times
- **Rollback Support**: Automatic rollback on errors

## 📝 Example Workflow

```sql
-- Generated script structure:
BEGIN TRY
  BEGIN TRANSACTION;
    -- === 1. DROP obsolete objects ===
    -- === 2. CREATE/ALTER tables and columns ===
    -- === 3. CREATE/ALTER constraints ===
    -- === 4. CREATE/ALTER indexes ===
    -- === 5. CREATE/ALTER views/SPs/functions/triggers ===
    -- === 6. Seed data updates ===
  COMMIT TRANSACTION;
END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION;
  THROW;
END CATCH;
```

## 🤝 Contributing

This project is designed for local use and development. Feel free to fork and customize for your specific needs.

