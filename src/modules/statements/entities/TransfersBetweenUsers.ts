import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";

@Entity("transfers_between_users")
class TransfersBetweenUsers {

  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid")
  sender_user_id: string;

  @Column("uuid")
  recipient_user_id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;


  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export {TransfersBetweenUsers}
