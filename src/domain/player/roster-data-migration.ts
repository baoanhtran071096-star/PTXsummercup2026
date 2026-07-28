export interface RosterPlayerItem {
  id: string;
  fullName: string;
  jerseyName: string;
  jerseyNumber: string;
  shirtSize: string;
  isCaptain?: boolean;
  shirtPrinted: boolean;
  shirtDelivered: boolean;
  notes?: string;
}

export const REAL_PTX_ROSTER_DATA: RosterPlayerItem[] = [
  { id: 'ply_001', fullName: 'Nguyễn Sử', jerseyName: 'Nguyễn Sử', jerseyNumber: '10', shirtSize: '2XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_002', fullName: 'Đình Huy', jerseyName: 'Đình Huy', jerseyNumber: '14', shirtSize: '2XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_003', fullName: 'ANH TỪ', jerseyName: 'ANH TỪ', jerseyNumber: '7', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_004', fullName: 'Mạnh Tún', jerseyName: 'Mạnh Tún', jerseyNumber: '02', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_005', fullName: 'Erling HaaTháiland', jerseyName: 'Erling HaaTháiland', jerseyNumber: '9', shirtSize: '2XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_006', fullName: 'Trần Bảo Anh', jerseyName: 'Kylian mBAppé', jerseyNumber: '9.5', shirtSize: '2XL', isCaptain: true, shirtPrinted: true, shirtDelivered: true, notes: 'Lead Developer & Captain' },
  { id: 'ply_007', fullName: 'M.Marquez', jerseyName: 'M.Marquez', jerseyNumber: '93', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_008', fullName: 'YuNaKa', jerseyName: 'YuNaKa', jerseyNumber: '10', shirtSize: 'M', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_009', fullName: 'ToQ', jerseyName: 'ToQ', jerseyNumber: 'N/A', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: false, notes: 'Không in số' },
  { id: 'ply_010', fullName: 'VERL', jerseyName: 'VERL', jerseyNumber: '11', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_011', fullName: 'AmphetamiN', jerseyName: 'AmphetamiN', jerseyNumber: '24', shirtSize: '3XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_012', fullName: 'ĐQ', jerseyName: 'ĐQ', jerseyNumber: '04', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_013', fullName: 'Mr.Cry', jerseyName: 'Mr.Cry', jerseyNumber: '76', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_014', fullName: 'Marcus', jerseyName: 'Marcus', jerseyNumber: '12', shirtSize: 'S', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_015', fullName: 'De', jerseyName: 'De', jerseyNumber: '79', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_016', fullName: 'Jub', jerseyName: 'Jub', jerseyNumber: '19', shirtSize: '2XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_017', fullName: 'Mon Trésor', jerseyName: 'Mon Trésor', jerseyNumber: '13', shirtSize: '2XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_018', fullName: 'Anh Trương', jerseyName: 'Anh Trương', jerseyNumber: '05', shirtSize: 'L', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_019', fullName: 'Nam Kun', jerseyName: 'Nam Kun', jerseyNumber: '70', shirtSize: 'L', shirtPrinted: true, shirtDelivered: true, notes: 'Áo tím' },
  { id: 'ply_020', fullName: 'Khang Nguyễn', jerseyName: 'Khang Nguyễn', jerseyNumber: '19', shirtSize: 'L', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_021', fullName: 'Bắp Kun', jerseyName: 'Bắp Kun', jerseyNumber: '10', shirtSize: 'Trẻ em', shirtPrinted: true, shirtDelivered: true, notes: 'Size trẻ em' },
  { id: 'ply_022', fullName: 'LA', jerseyName: 'LA', jerseyNumber: '80', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_023', fullName: 'Dylan Lưu', jerseyName: 'Dylan Lưu', jerseyNumber: '22', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_024', fullName: 'Long Phạm', jerseyName: 'Long Phạm', jerseyNumber: '13', shirtSize: 'XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_025', fullName: 'Phương Toàn', jerseyName: 'Phương Toàn', jerseyNumber: '21', shirtSize: '2XL', shirtPrinted: true, shirtDelivered: true },
  { id: 'ply_026', fullName: 'Cầu thủ Dự bị', jerseyName: '(Chưa in)', jerseyNumber: 'N/A', shirtSize: 'XL', shirtPrinted: false, shirtDelivered: false, notes: 'Không tên, số' }
];
