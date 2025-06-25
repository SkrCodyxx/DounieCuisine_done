import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Users,
  Clock,
  DollarSign,
  Mail,
  Phone
} from "lucide-react";

const createEmployeeSchema = z.object({
  username: z.string().min(3, "Username doit avoir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit avoir au moins 6 caractères"),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phoneNumber: z.string().optional(),
  role: z.enum(["staff", "manager"]),
  department: z.string().optional(),
  hourlyRate: z.number().min(0, "Taux horaire doit être positif").optional(),
  startDate: z.string(),
});

type CreateEmployeeForm = z.infer<typeof createEmployeeSchema>;

interface Employee {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  department?: string;
  hourlyRate?: number;
  startDate?: string;
  isActive: boolean;
  createdAt: string;
}

interface StaffManagementProps {
  employees: Employee[];
}

export function StaffManagement({ employees }: StaffManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const form = useForm<CreateEmployeeForm>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "staff",
      department: "",
      startDate: new Date().toISOString().split('T')[0],
    }
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: CreateEmployeeForm) => {
      return apiRequest("/api/admin/employees", { method: "POST", body: data });
    },
    onSuccess: () => {
      toast({
        title: "Employé créé avec succès",
        description: "Le nouveau compte employé a été créé",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setShowCreateDialog(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur création employé",
        description: error.message || "Impossible de créer l'employé",
        variant: "destructive"
      });
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: number) => {
      return apiRequest(`/api/admin/employees/${employeeId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({
        title: "Employé supprimé",
        description: "Le compte employé a été supprimé",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur suppression",
        description: error.message || "Impossible de supprimer l'employé",
        variant: "destructive"
      });
    }
  });

  const handleCreateEmployee = (data: CreateEmployeeForm) => {
    createEmployeeMutation.mutate(data);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
      deleteEmployeeMutation.mutate(employeeId);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "staff": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const staffEmployees = employees?.filter(emp => ["staff", "manager"].includes(emp.role)) || [];
  const managers = staffEmployees.filter(emp => emp.role === "manager");
  const staff = staffEmployees.filter(emp => emp.role === "staff");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion du Personnel</h2>
          <p className="text-gray-600">Gérez les comptes employés et leurs accès</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau Employé
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Compte Employé</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateEmployee)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="staff">Employé</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createEmployeeMutation.isPending}
                  >
                    {createEmployeeMutation.isPending ? "Création..." : "Créer"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            <Users className="w-4 h-4 mr-2" />
            Tous ({staffEmployees.length})
          </TabsTrigger>
          <TabsTrigger value="managers">
            <Shield className="w-4 h-4 mr-2" />
            Managers ({managers.length})
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Clock className="w-4 h-4 mr-2" />
            Staff ({staff.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <EmployeeTable 
            employees={staffEmployees} 
            onDelete={handleDeleteEmployee}
            onView={setSelectedEmployee}
          />
        </TabsContent>

        <TabsContent value="managers">
          <EmployeeTable 
            employees={managers} 
            onDelete={handleDeleteEmployee}
            onView={setSelectedEmployee}
          />
        </TabsContent>

        <TabsContent value="staff">
          <EmployeeTable 
            employees={staff} 
            onDelete={handleDeleteEmployee}
            onView={setSelectedEmployee}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmployeeTable({ 
  employees, 
  onDelete, 
  onView 
}: { 
  employees: Employee[]; 
  onDelete: (id: number) => void;
  onView: (employee: Employee) => void;
}) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "staff": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-gray-500">@{employee.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getRoleBadgeColor(employee.role)}>
                      {employee.role === "manager" ? "Manager" : "Staff"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {employee.email}
                      </div>
                      {employee.phoneNumber && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {employee.phoneNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={employee.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {employee.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(employee)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(employee.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}