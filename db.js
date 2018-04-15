const pg = require("pg");
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/cancounter';
const connection = new pg.Client(CONNECTION_STRING);
connection.connect();

const init_tables = (db, next) => {
    const create_table_statements = [`
    create table if not exists charities (
        name varchar(128) primary key,
        imgurl varchar(128),
        description text,
        location varchar(256),
        website_url varchar(128),
        added date default CURRENT_DATE
    )
    `,
    `
    create table if not exists active_ranges (
        start_time timestamp unique not null,
        end_time timestamp unique,
        charity_name varchar(128),
        foreign key (charity_name) references charities (name),
        primary key (start_time, end_time)
    )
    `,
    `
    create table if not exists kiosks (
        id serial primary key,
        name varchar(128) unique not null,
        location varchar(128),
        last_reset timestamp default now()
    )
    `,
    `
    create table if not exists can_submissions (
        kiosk integer not null,
        occurred timestamp not null default now(),
        charity varchar(128) not null,
        foreign key (kiosk) references kiosks (id),
        foreign key (charity) references charities (name),
        primary key (kiosk, occurred)
    )
    `,
    `
    create or replace view kiosk_cans_since_reset as
    select k.name, k.id, count(*) as cans
    from kiosks k, can_submissions c
    where k.id = c.kiosk
    and c.occurred > k.last_reset
    group by k.name, k.id
    `,
    `
    create or replace view kiosk_totals as
    select .03 * count(*) as money_earned, count(*) as total_cans, k.name, k.id
    from kiosks k, can_submissions c
    where k.id = c.kiosk
    group by k.name, k.id
    `,
    `
    create or replace view kiosk_last_hour as 
    select .03 * count(*) as money, count(*) as cans, k.name, k.id
    from kiosks k, can_submissions c
    where k.id = c.kiosk
    and c.occurred > now() - interval '1 hour'
    group by k.name, k.id
    `,
    `
    create or replace view kiosk_summary as
    select k.id, k.name, k.location, k.last_reset, r.cans as current_cans, t.total_cans as total_cans, t.money_earned as total_earned, h.money as money_in_last_hour, h.cans as cans_in_last_hour
    from kiosks k, kiosk_cans_since_reset r, kiosk_totals t, kiosk_last_hour h
    where k.id = r.id
    and k.id = t.id
    and k.id = h.id
    `,
    `
    create or replace view charity_totals as
    select .03 * count(*) as total_earned, count(*) as total_cans, k.name as charity_name
    from charities l, can_submissions c
    where k.name = c.charity
    group by k.name
    `,
    `
    create or replace view charity_summary as
    select *
    from charity_totals t, charities c
    where t.charity_name = c.name
    `
    ];
    Promise.all(create_table_statements.map((statement) => db.query(statement))).then(() => {next()}, console.log);

};



module.exports = {
    'db': connection,
    'init': init_tables
};