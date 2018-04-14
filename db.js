const pg = require("pg");
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/cancounter';
const async = require("async");
const connection = new pg.Client(CONNECTION_STRING);
connection.connect();

const init_tables = (db, next) => {
    const create_table_statements = [
        `create table if not exists charities (
        name varchar(128) primary key,
        imgurl varchar(128),
        description varchar(256),
        location varchar(256),
        website_url varchar(128),
        total_earned float4 default 0,
        total_cans int default 0,
        added date default CURRENT_DATE
    )`,
    `create table if not exists active_ranges (
        start_time timestamp unique not null,
        end_time timestamp unique,
        charity_name varchar(128),
        foreign key (charity_name) references charities (name),
        primary key (start_time, end_time)
    )`,
    `create table if not exists kiosks (
        id serial primary key,
        name varchar(128) unique not null,
        location varchar(128),
        last_reset timestamp default now()
    )`,
    `create table if not exists can_submissions (
        kiosk integer not null,
        occurred timestamp not null,
        charity varchar(128) not null,
        foreign key (kiosk) references kiosks (id),
        foreign key (charity) references charities (name),
        primary key (kiosk, occurred)
    )`,
    `create or replace view kiosk_cans_since_reset as
    select k.name, count(*) as cans
    from kiosks k, can_submissions c
    where k.id = c.kiosk
    and c.occurred > k.last_reset
    group by k.name;
    `,
    ];
    Promise.all(create_table_statements.map((statement) => db.query(statement))).then(() => {next()});

};



module.exports = {
    'db': connection,
    'init': init_tables
};