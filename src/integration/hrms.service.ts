/**
 * PTX HRMS Integration Service (Task 7.1.1)
 * Synchronizes employee directory from PTX Group HRMS and auto-provisions accounts.
 */

export interface HRMSEmployee {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  role: 'ADMIN' | 'STAFF' | 'ORGANIZER' | 'FAN';
  active: boolean;
}

export class HRMSIntegrationService {
  private employeeRegistry: Map<string, HRMSEmployee> = new Map();

  constructor() {
    // Seed initial PTX Group employees
    this.seedDefaultEmployees();
  }

  private seedDefaultEmployees(): void {
    const defaultStaff: HRMSEmployee[] = [
      {
        employeeId: 'PTX-001',
        fullName: 'PTX Admin User',
        email: 'admin@ptxsummercup.vn',
        department: 'Executive Board',
        role: 'ADMIN',
        active: true
      },
      {
        employeeId: 'PTX-002',
        fullName: 'PTX Match Coordinator',
        email: 'coordinator@ptxsummercup.vn',
        department: 'Sports Event Management',
        role: 'ORGANIZER',
        active: true
      }
    ];

    for (const emp of defaultStaff) {
      this.employeeRegistry.set(emp.employeeId, emp);
    }
  }

  public syncEmployeesFromHRMS(employees: HRMSEmployee[]): { syncedCount: number; newAccountsCreated: number } {
    let newAccountsCreated = 0;

    for (const emp of employees) {
      if (!this.employeeRegistry.has(emp.employeeId)) {
        newAccountsCreated++;
      }
      this.employeeRegistry.set(emp.employeeId, emp);
    }

    return {
      syncedCount: employees.length,
      newAccountsCreated
    };
  }

  public getEmployeeById(employeeId: string): HRMSEmployee | undefined {
    return this.employeeRegistry.get(employeeId);
  }

  public getEmployeeByEmail(email: string): HRMSEmployee | undefined {
    return Array.from(this.employeeRegistry.values()).find(e => e.email === email);
  }
}

export const hrmsService = new HRMSIntegrationService();
