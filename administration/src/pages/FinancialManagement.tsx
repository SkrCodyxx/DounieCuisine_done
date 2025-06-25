import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface FinancialTransaction {
  id: number;
  type: string;
  category: string;
  amount: string;
  description: string;
  date: string;
  paymentMethod: string;
  taxDeductible: boolean;
  gstAmount: string;
  qstAmount: string;
  notes: string;
  createdBy: number;
}

export function FinancialManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedType, setSelectedType] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["financial-transactions", selectedPeriod, selectedType],
    queryFn: async () => {
      const response = await fetch(`/api/admin/finances/transactions?period=${selectedPeriod}&type=${selectedType}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
  });

  const { data: financialSummary } = useQuery({
    queryKey: ["financial-summary", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/admin/finances/summary?period=${selectedPeriod}`);
      if (!response.ok) throw new Error("Failed to fetch financial summary");
      return response.json();
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/finances/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Transaction créée avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const TransactionForm = ({ onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      type: "",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "",
      taxDeductible: false,
      notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const categories = {
      income: ["sales", "services", "tips", "other"],
      expense: ["ingredients", "salaries", "rent", "utilities", "marketing", "equipment", "other"],
      tax: ["gst", "qst", "income_tax", "business_tax"],
      payroll: ["salaries", "benefits", "deductions"]
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de transaction</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, category: "" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Revenus</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
                <SelectItem value="tax">Taxes</SelectItem>
                <SelectItem value="payroll">Paie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formData.type && categories[formData.type as keyof typeof categories]?.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "sales" ? "Ventes" :
                     cat === "services" ? "Services" :
                     cat === "tips" ? "Pourboires" :
                     cat === "ingredients" ? "Ingrédients" :
                     cat === "salaries" ? "Salaires" :
                     cat === "rent" ? "Loyer" :
                     cat === "utilities" ? "Services publics" :
                     cat === "marketing" ? "Marketing" :
                     cat === "equipment" ? "Équipement" :
                     cat === "benefits" ? "Avantages" :
                     cat === "deductions" ? "Déductions" :
                     cat === "gst" ? "TPS" :
                     cat === "qst" ? "TVQ" :
                     cat === "income_tax" ? "Impôt sur le revenu" :
                     cat === "business_tax" ? "Taxe d'affaires" :
                     "Autre"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Méthode de paiement</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Comptant</SelectItem>
              <SelectItem value="card">Carte</SelectItem>
              <SelectItem value="transfer">Virement</SelectItem>
              <SelectItem value="check">Chèque</SelectItem>
              <SelectItem value="online">En ligne</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Créer transaction
          </Button>
        </div>
      </form>
    );
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des données financières...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion financière</h1>
            <p className="text-muted-foreground">
              Suivez les revenus, dépenses et analyses financières
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle transaction</DialogTitle>
                  <DialogDescription>
                    Enregistrez une transaction financière
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm
                  onSubmit={(data: any) => createTransactionMutation.mutate(data)}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${financialSummary?.totalIncome || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{financialSummary?.incomeChange || 0}% ce {selectedPeriod === "month" ? "mois" : "trimestre"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${financialSummary?.totalExpenses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{financialSummary?.expenseChange || 0}% ce {selectedPeriod === "month" ? "mois" : "trimestre"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit net</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${financialSummary?.netProfit || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Marge: {financialSummary?.profitMargin || 0}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxes</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${financialSummary?.totalTaxes || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                TPS/TVQ payables
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenus vs Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialSummary?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#10B981" name="Revenus" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Dépenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={financialSummary?.expenseBreakdown || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {financialSummary?.expenseBreakdown?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transactions récentes</CardTitle>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="income">Revenus</SelectItem>
                  <SelectItem value="expense">Dépenses</SelectItem>
                  <SelectItem value="tax">Taxes</SelectItem>
                  <SelectItem value="payroll">Paie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions?.map((transaction: FinancialTransaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "income" ? "bg-green-100" :
                      transaction.type === "expense" ? "bg-red-100" :
                      transaction.type === "tax" ? "bg-purple-100" : "bg-blue-100"
                    }`}>
                      <DollarSign className={`w-5 h-5 ${
                        transaction.type === "income" ? "text-green-600" :
                        transaction.type === "expense" ? "text-red-600" :
                        transaction.type === "tax" ? "text-purple-600" : "text-blue-600"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {transaction.type === "income" ? "Revenus" :
                           transaction.type === "expense" ? "Dépenses" :
                           transaction.type === "tax" ? "Taxes" : "Paie"}
                        </Badge>
                        <span>•</span>
                        <span className="capitalize">{transaction.category}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                    </p>
                    {transaction.paymentMethod && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.paymentMethod === "cash" ? "Comptant" :
                         transaction.paymentMethod === "card" ? "Carte" :
                         transaction.paymentMethod === "transfer" ? "Virement" :
                         transaction.paymentMethod === "check" ? "Chèque" :
                         transaction.paymentMethod === "online" ? "En ligne" : transaction.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}