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
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, User, DollarSign, Calendar } from "lucide-react";

interface Employee {
  id: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
  };
  employeeId: string;
  position: string;
  department: string;
  hireDate: string;
  hourlyRate: string;
  isActive: boolean;
}

export function StaffManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await fetch("/api/admin/employees");
      if (!response.ok) throw new Error("Échec de la récupération des employés");
      return response.json();
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Échec de la création de l'employé");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Employé créé avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Création",
        description: error.message || "Une erreur est survenue lors de la création de l'employé.",
        variant: "destructive",
      });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la mise à jour de l'employé" }));
        throw new Error(errorData.message || "Échec de la mise à jour de l'employé");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditingEmployee(null);
      toast({ title: "Employé mis à jour avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Modification",
        description: error.message || "Une erreur est survenue lors de la modification de l'employé.",
        variant: "destructive",
      });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la suppression de l'employé" }));
        throw new Error(errorData.message || "Échec de la suppression de l'employé");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Employé supprimé avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Suppression",
        description: error.message || "Une erreur est survenue lors de la suppression de l'employé.",
        variant: "destructive",
      });
    },
  });

  const EmployeeForm = ({ employee, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      firstName: employee?.user?.firstName || "",
      lastName: employee?.user?.lastName || "",
      email: employee?.user?.email || "",
      username: employee?.user?.username || "",
      password: "",
      role: employee?.user?.role || "staff",
      position: employee?.position || "",
      department: employee?.department || "",
      hourlyRate: employee?.hourlyRate || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        {!employee && (
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Personnel</SelectItem>
                <SelectItem value="manager">Gestionnaire</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un département"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cuisine">Cuisine</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="management">Direction</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Salaire horaire ($CA)</Label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {employee ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des employés...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion du personnel</h1>
            <p className="text-muted-foreground">
              Gérez les employés et leurs informations
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel employé
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouvel employé</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau membre à l'équipe
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm
                onSubmit={(data: any) => createEmployeeMutation.mutate(data)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {employees?.map((employee: Employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle>{employee.user.firstName} {employee.user.lastName}</CardTitle>
                      <CardDescription>{employee.position} - {employee.department}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={employee.isActive ? "default" : "secondary"}>
                      {employee.isActive ? "Actif" : "Inactif"}
                    </Badge>
                    <Badge variant="outline">
                      {employee.user.role === "admin" ? "Admin" : 
                       employee.user.role === "manager" ? "Gestionnaire" : "Personnel"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">ID Employé</p>
                    <p>{employee.employeeId}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Email</p>
                    <p>{employee.user.email}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">Salaire/h</p>
                      <p>{employee.hourlyRate} $CA</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">Embauché</p>
                      <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Dialog open={editingEmployee?.id === employee.id} onOpenChange={(open) => !open && setEditingEmployee(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingEmployee(employee)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Modifier l'employé</DialogTitle>
                        <DialogDescription>
                          Modifiez les informations de {employee.user.firstName} {employee.user.lastName}
                        </DialogDescription>
                      </DialogHeader>
                      <EmployeeForm
                        employee={employee}
                        onSubmit={(data: any) => updateEmployeeMutation.mutate({ id: employee.id, data })}
                        onCancel={() => setEditingEmployee(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteEmployeeMutation.mutate(employee.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {employees?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun employé</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter des membres à votre équipe
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un employé
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}