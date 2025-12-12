import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Play, Loader2, Server, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
}

function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [response, setResponse] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const exampleEndpoint = `${baseUrl}/cpf/64408760404`;

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: "Copiado!", description: "Texto copiado para a \u00e1rea de transfer\u00eancia" });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = async () => {
    const cleanedCpf = cleanCPF(cpf);
    if (cleanedCpf.length !== 11) {
      toast({ 
        title: "CPF inv\u00e1lido", 
        description: "O CPF deve conter 11 d\u00edgitos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`/cpf/${cleanedCpf}`);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ 
        statusCode: 500, 
        error: "Erro ao conectar com a API" 
      });
    } finally {
      setLoading(false);
    }
  };

  const curlExample = `curl -X GET "${baseUrl}/cpf/64408760404"`;
  
  const jsExample = `fetch("${baseUrl}/cpf/64408760404")
  .then(res => res.json())
  .then(data => console.log(data));`;

  const pythonExample = `import requests

response = requests.get("${baseUrl}/cpf/64408760404")
data = response.json()
print(data)`;

  const responseExample = `{
  "statusCode": 200,
  "data": {
    "status": 200,
    "cpf": "644.087.604-04",
    "nome": "Nome Completo",
    "nascimento": "01/01/1990",
    "sexo": "Masculino",
    "mae": "Nome da M\u00e3e",
    "requisicoes_restantes": 99999
  }
}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            API Proxy HTTPS
          </Badge>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Consulta de CPF
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            API intermedi\u00e1ria com HTTPS para consulta de dados de CPF. 
            Encapsula requisi\u00e7\u00f5es HTTP em uma camada segura.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium">HTTPS Seguro</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Todas as requisi\u00e7\u00f5es s\u00e3o feitas via HTTPS, garantindo seguran\u00e7a na comunica\u00e7\u00e3o.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium">Resposta R\u00e1pida</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Proxy otimizado com baixa lat\u00eancia para respostas instant\u00e2neas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium">API RESTful</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Endpoint simples e f\u00e1cil de integrar em qualquer aplica\u00e7\u00e3o.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-md font-mono text-sm">
              <Badge variant="default" className="shrink-0">GET</Badge>
              <code className="flex-1 overflow-x-auto" data-testid="text-endpoint">
                {baseUrl}/cpf/:cpf
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopy(`${baseUrl}/cpf/:cpf`, "endpoint")}
                data-testid="button-copy-endpoint"
              >
                {copied === "endpoint" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Substitua <code className="bg-muted px-1 py-0.5 rounded">:cpf</code> pelo n\u00famero do CPF (apenas n\u00fameros, sem pontos ou tra\u00e7os).
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Testar API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Digite o CPF (ex: 644.087.604-04)"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                className="font-mono"
                data-testid="input-cpf"
              />
              <Button 
                onClick={handleTest} 
                disabled={loading}
                className="shrink-0"
                data-testid="button-test"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Testar
              </Button>
            </div>

            {response && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Resposta:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(JSON.stringify(response, null, 2), "response")}
                    data-testid="button-copy-response"
                  >
                    {copied === "response" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <pre 
                  className="p-4 bg-zinc-900 text-zinc-100 rounded-md overflow-x-auto text-sm font-mono"
                  data-testid="text-response"
                >
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Exemplos de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl">
              <TabsList className="mb-4">
                <TabsTrigger value="curl" data-testid="tab-curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript" data-testid="tab-javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python" data-testid="tab-python">Python</TabsTrigger>
              </TabsList>

              <TabsContent value="curl">
                <div className="relative">
                  <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-md overflow-x-auto text-sm font-mono">
                    {curlExample}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                    onClick={() => handleCopy(curlExample, "curl")}
                    data-testid="button-copy-curl"
                  >
                    {copied === "curl" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="javascript">
                <div className="relative">
                  <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-md overflow-x-auto text-sm font-mono">
                    {jsExample}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                    onClick={() => handleCopy(jsExample, "js")}
                    data-testid="button-copy-js"
                  >
                    {copied === "js" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="python">
                <div className="relative">
                  <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-md overflow-x-auto text-sm font-mono">
                    {pythonExample}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                    onClick={() => handleCopy(pythonExample, "python")}
                    data-testid="button-copy-python"
                  >
                    {copied === "python" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Exemplo de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-md overflow-x-auto text-sm font-mono">
                {responseExample}
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                onClick={() => handleCopy(responseExample, "example")}
                data-testid="button-copy-example"
              >
                {copied === "example" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">C\u00f3digos de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                <Badge className="bg-green-600 hover:bg-green-600">200</Badge>
                <div>
                  <p className="font-medium text-sm">Sucesso</p>
                  <p className="text-xs text-muted-foreground">CPF encontrado e dados retornados</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                <Badge className="bg-yellow-600 hover:bg-yellow-600">400</Badge>
                <div>
                  <p className="font-medium text-sm">Requisi\u00e7\u00e3o Inv\u00e1lida</p>
                  <p className="text-xs text-muted-foreground">Formato de CPF inv\u00e1lido</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                <Badge className="bg-orange-600 hover:bg-orange-600">404</Badge>
                <div>
                  <p className="font-medium text-sm">N\u00e3o Encontrado</p>
                  <p className="text-xs text-muted-foreground">CPF n\u00e3o encontrado na base de dados</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                <Badge className="bg-red-600 hover:bg-red-600">500</Badge>
                <div>
                  <p className="font-medium text-sm">Erro do Servidor</p>
                  <p className="text-xs text-muted-foreground">Erro interno ou API original indispon\u00edvel</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>API Proxy para Consulta de CPF via HTTPS</p>
        </footer>
      </div>
    </div>
  );
}
