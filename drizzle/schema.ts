import { mysqlTable, mysqlSchema, AnyMySqlColumn, varchar, int, date, timestamp, datetime, text, mediumtext } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"
import { boolean } from "drizzle-orm/gel-core";

export const attendanceRecord = mysqlTable("attendance_record", {
	eNumber: varchar({ length: 10 }).notNull(),
	meetingId: int("meeting_id").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	checkInTime: date("check_in_time", { mode: 'string' }).default('NULL'),
});

export const classes = mysqlTable("classes", {
	id: int().autoincrement().notNull(),
	dateCreated: timestamp("date_created", { mode: 'string' }).default('current_timestamp()').notNull(),
	teacher: int().default('NULL'),
	name: varchar({ length: 50 }).notNull(),
	description: varchar({ length: 500 }).notNull(),
	recurring: int().notNull(),
	rosterFile: varchar("roster_file", { length: 1000 }).default('NULL'),
});

export const meetings = mysqlTable("meetings", {
	id: int().autoincrement().notNull(),
	class: int().notNull(),
	location: varchar({ length: 30 }).notNull(),
	date: datetime({ mode: 'string'}).default('NULL'),
	qrcode: text().default('NULL'),
	cancelled: int().default(0),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	eNumber: varchar({ length: 10 }).notNull(),
	passwordHash: mediumtext("password_hash").notNull(),
	admin: int().notNull(),
	firstName: varchar("first_name", { length: 20 }).notNull(),
	lastName: varchar("last_name", { length: 20 }).notNull(),
});
