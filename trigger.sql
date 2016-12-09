create trigger test after insert on stats
when 15 < (select count() from stats where id_sensor=new.id_sensor)
begin
	delete from stats where id in (select id from stats where id_sensor=new.id_sensor order by id asc limit 1);
end;
