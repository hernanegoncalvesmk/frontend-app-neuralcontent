export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Neural Content
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Frontend em desenvolvimento - Estrutura limpa e pronta para implementação
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">🎯 Status do Projeto</h2>
            <div className="space-y-2 text-left">
              <p className="text-green-600">✅ Estrutura base configurada</p>
              <p className="text-green-600">✅ Páginas desnecessárias removidas</p>
              <p className="text-green-600">✅ Componentes essenciais mantidos</p>
              <p className="text-yellow-600">🔄 Próximo: Configurar estrutura Neural Content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
