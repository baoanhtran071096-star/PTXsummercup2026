import { PlayerEntity } from './player-model';

export const REAL_TEAMS = [
  { id: 'team_01', name: 'Đội P', code: 'P', logo: '🛡️', captain: 'Trần Bảo Anh (Kylian mBAppé #9.5)', playerCount: 26, primaryColor: '#00f2fe' },
  { id: 'team_02', name: 'Đội T', code: 'T', logo: '⭐', captain: 'Trần Tuấn Anh (#6)', playerCount: 18, primaryColor: '#ffb703' },
  { id: 'team_03', name: 'Đội X', code: 'X', logo: '🚀', captain: 'Đình Huy (#14)', playerCount: 16, primaryColor: '#ff4d6d' }
];

export const LEGACY_REAL_TEAMS = REAL_TEAMS;

export const REAL_ROSTER_PLAYERS: PlayerEntity[] = [
  { id: 'ply_001', teamId: 'team_01', fullName: 'Nguyễn Sử', jerseyName: 'Nguyễn Sử', jerseyNumber: '10', shirtSize: '2XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_002', teamId: 'team_01', fullName: 'Đình Huy', jerseyName: 'Đình Huy', jerseyNumber: '14', shirtSize: '2XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_003', teamId: 'team_01', fullName: 'ANH TỪ', jerseyName: 'ANH TỪ', jerseyNumber: '7', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_004', teamId: 'team_01', fullName: 'Mạnh Tuấn', jerseyName: 'Mạnh Tún', jerseyNumber: '02', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_005', teamId: 'team_01', fullName: 'Erling HaaTháiland', jerseyName: 'Erling HaaTháiland', jerseyNumber: '9', shirtSize: '2XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Tiền đạo' },
  { id: 'ply_006', teamId: 'team_01', fullName: 'Trần Bảo Anh', jerseyName: 'Kylian mBAppé', jerseyNumber: '9.5', shirtSize: '2XL', isCaptain: true, shirtPrinted: true, shirtDelivered: true, notes: 'Lead Developer & Captain [C]' },
  { id: 'ply_007', teamId: 'team_01', fullName: 'M.Marquez', jerseyName: 'M.Marquez', jerseyNumber: '93', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_008', teamId: 'team_01', fullName: 'YuNaKa', jerseyName: 'YuNaKa', jerseyNumber: '10', shirtSize: 'M', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_009', teamId: 'team_01', fullName: 'ToQ', jerseyName: 'ToQ', jerseyNumber: 'N/A', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: false, notes: 'Không in số' },
  { id: 'ply_010', teamId: 'team_01', fullName: 'VERL', jerseyName: 'VERL', jerseyNumber: '11', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_011', teamId: 'team_01', fullName: 'AmphetamiN', jerseyName: 'AmphetamiN', jerseyNumber: '24', shirtSize: '3XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_012', teamId: 'team_01', fullName: 'Đăng Quân', jerseyName: 'ĐQ', jerseyNumber: '04', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_013', teamId: 'team_01', fullName: 'Mr.Cry', jerseyName: 'Mr.Cry', jerseyNumber: '76', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_014', teamId: 'team_01', fullName: 'Marcus', jerseyName: 'Marcus', jerseyNumber: '12', shirtSize: 'S', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_015', teamId: 'team_01', fullName: 'De', jerseyName: 'De', jerseyNumber: '79', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_016', teamId: 'team_01', fullName: 'Jub', jerseyName: 'Jub', jerseyNumber: '19', shirtSize: '2XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_017', teamId: 'team_01', fullName: 'Mon Trésor', jerseyName: 'Mon Trésor', jerseyNumber: '13', shirtSize: '2XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_018', teamId: 'team_01', fullName: 'Anh Trương', jerseyName: 'Anh Trương', jerseyNumber: '05', shirtSize: 'L', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_019', teamId: 'team_01', fullName: 'Hoàng Nam', jerseyName: 'Nam Kun', jerseyNumber: '70', shirtSize: 'L', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Áo tím' },
  { id: 'ply_020', teamId: 'team_01', fullName: 'Khang Nguyễn', jerseyName: 'Khang Nguyễn', jerseyNumber: '19', shirtSize: 'L', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_021', teamId: 'team_01', fullName: 'Bắp Kun', jerseyName: 'Bắp Kun', jerseyNumber: '10', shirtSize: 'Trẻ em', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Size trẻ em' },
  { id: 'ply_022', teamId: 'team_01', fullName: 'LA', jerseyName: 'LA', jerseyNumber: '80', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_023', teamId: 'team_01', fullName: 'Dylan Lưu', jerseyName: 'Dylan Lưu', jerseyNumber: '22', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_024', teamId: 'team_01', fullName: 'Long Phạm', jerseyName: 'Long Phạm', jerseyNumber: '13', shirtSize: 'XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_025', teamId: 'team_01', fullName: 'Phương Toàn', jerseyName: 'Phương Toàn', jerseyNumber: '21', shirtSize: '2XL', isCaptain: false, shirtPrinted: true, shirtDelivered: true, notes: 'Cầu thủ chính' },
  { id: 'ply_026', teamId: 'team_01', fullName: 'Cầu thủ Dự bị', jerseyName: '(Chưa in)', jerseyNumber: 'N/A', shirtSize: 'XL', isCaptain: false, shirtPrinted: false, shirtDelivered: false, notes: 'Không tên, số' }
];

export const REAL_PTX_ROSTER_DATA = REAL_ROSTER_PLAYERS;
