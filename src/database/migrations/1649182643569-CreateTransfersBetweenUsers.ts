import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransfersBetweenUsers1649182643569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "transfers_between_users",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true
            },
            {
              name: "sender_user_id",
              type: "uuid"
            },
            {
              name: "recipient_user_id",
              type: "uuid"
            },
            {
              name: "amount",
              type: "decimal",
              precision: 5,
              scale: 2
            },
            {
              name: "description",
              type: "varchar"
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()'
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()'
            }
          ],
          foreignKeys: [
            {
              name: "FKSenderUser",
              columnNames: ['sender_user_id'],
              referencedTableName: 'users',
              referencedColumnNames: ["id"],
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE'
            },
            {
              name: "FKRecipientUser",
              columnNames: ['recipient_user_id'],
              referencedTableName: "users",
              referencedColumnNames: ["id"],
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          ]
        })
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("transfers_between_users")
    }

}
