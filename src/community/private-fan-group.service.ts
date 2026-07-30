/**
 * Private Fan Group Chat Service (Task B.1)
 * Enables creation of private fan groups, invite link generation, and member messaging.
 */

export interface PrivateFanGroup {
  groupId: string;
  groupName: string;
  creatorEmail: string;
  inviteCode: string;
  memberEmails: string[];
  createdAt: string;
}

export class PrivateFanGroupService {
  private groups: Map<string, PrivateFanGroup> = new Map();

  public createFanGroup(groupName: string, creatorEmail: string): PrivateFanGroup {
    const groupId = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const group: PrivateFanGroup = {
      groupId,
      groupName,
      creatorEmail,
      inviteCode: `JOIN_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      memberEmails: [creatorEmail],
      createdAt: new Date().toISOString()
    };
    this.groups.set(groupId, group);
    return group;
  }

  public joinFanGroup(groupId: string, userEmail: string): boolean {
    const group = this.groups.get(groupId);
    if (!group) return false;

    if (!group.memberEmails.includes(userEmail)) {
      group.memberEmails.push(userEmail);
    }
    return true;
  }

  public getGroup(groupId: string): PrivateFanGroup | undefined {
    return this.groups.get(groupId);
  }
}

export const privateFanGroupService = new PrivateFanGroupService();
