package Timeline::Storage::DBAccess;

use Timeline::Class::Interface;
use Timeline::Utils::DateHelper;
use Dancer::Plugin::Database;
use Date::Parse;
use POSIX qw(strftime);

my $dbEngine = "sqlite";
my $databaseConfig = "projectplan-".$dbEngine;

my $dbConn = database($databaseConfig);
my $simileDateFormat = "%a %b %e %Y %H:%M:%S GMT-0600";
my $defaultDateFormat = "%Y-%m-%dT%H:%M:%S+02:00";

sub getTimelineEntries {

    my ($class, $workstream, $searchpattern, $tags) = @_;
    
    # ----------------------------------------------
    # Create select statement
    # ----------------------------------------------
    
    $where = "";
    if (defined $workstream && length $workstream > 0) {
	$where .= " AND workstream_id = ".$workstream;
    }
    
    if (defined $searchpattern && length $searchpattern > 0 && $searchpattern ne '_empty_') {
	$where .= " AND (title LIKE \'%".$searchpattern."%\' OR description LIKE \'%".$searchpattern."%\')";    
    }
    
    my @tagsArr = split(',', $tags);
    if (scalar @tagsArr > 0) {
	
	$result = "";
	for (my $i=0; $i!=scalar @tagsArr; $i++) {
	    $result .= '"'.@tagsArr[$i].'"';
	    
	    if ($i < scalar @tagsArr -1) {
		$result .= ",";
	    }
	}
	
	$where .= " AND classname IN (".$result.")";
    }
    
    # ----------------------------------------------
    # Execute query
    # ----------------------------------------------

    my $query = $dbConn->prepare("SELECT event_id, workstream_id, start_date, end_date, 
	title, classname, is_active 
	FROM event WHERE is_active='Y' ".$where." ORDER BY start_date");
    
    $query->execute;
    
    my @entries = ();
    $rowCount = 0;
    while (my $row = $query->fetchrow_hashref) {
    
	$row->{start_date} = Timeline::Utils::DateHelper->formatDate($row->{start_date}, $simileDateFormat);
	$row->{is_duration} = "false";
	
	if (defined $row->{end_date} && length $row->{end_date} > 0) {
	    $row->{end_date} = Timeline::Utils::DateHelper->formatDate($row->{end_date}, $simileDateFormat);
	    $row->{is_duration} = "true";
	}
	
	$entries[$rowCount] = $row;
	$rowCount++;
    }
    
    return @entries;
}

sub getAllTimelineEntries {

    # ----------------------------------------------
    # Execute query
    # ----------------------------------------------

    my $query = $dbConn->prepare("SELECT classname, description, event_id as eventId, start_date as startDate, 
	end_date as endDate, title, workstream_id as workstreamId 
	FROM event ORDER BY start_date");
    
    $query->execute;
    
    my @entries = ();
    $rowCount = 0;
    while (my $row = $query->fetchrow_hashref) {
    
	$row->{startDate} = Timeline::Utils::DateHelper->formatDate($row->{startDate}, $simileDateFormat);
	$row->{is_duration} = "false";
	
	if (defined $row->{endDate} && length $row->{endDate} > 0) {
	    $row->{endDate} = Timeline::Utils::DateHelper->formatDate($row->{endDate}, $simileDateFormat);
	    $row->{is_duration} = "true";
	}
	
	$entries[$rowCount] = $row;
	$rowCount++;
    }
    
    return @entries;
}


sub getAllWorkstream {

    # ----------------------------------------------
    # Execute query
    # ----------------------------------------------

    my $query = $dbConn->prepare("SELECT workstream_id, name, password FROM workstream");
    
    $query->execute;
    
    my @entries = ();
    $rowCount = 0;
    while (my $row = $query->fetchrow_hashref) {
	
	$row->{workstreamId} = $row->{workstream_id};
	delete $row->{workstream_id};
	
	$entries[$rowCount] = $row;
	$rowCount++;
    }
    
    return @entries;
}


sub getEventDetails {

    my ($class, $eventId) = @_;

    my $query = $dbConn->prepare("SELECT classname, description, event_id as eventId, 
	start_date as startDate, end_date as endDate, title, workstream_id as workstreamId 
	FROM event WHERE event_id = '".$eventId."'");
    
    $query->execute;
    
    while (my $row = $query->fetchrow_hashref) {

	$row->{startDate} = Timeline::Utils::DateHelper->formatDate($row->{startDate}, $defaultDateFormat);
	
	if (defined $row->{endDate} && length $row->{endDate} > 0) {
	    $row->{endDate} = Timeline::Utils::DateHelper->formatDate($row->{endDate}, $defaultDateFormat);
	} 
	else {
	    delete $row->{endDate};
	}
    
	return $row;    
    }
    
    return;
}

sub getWorkstreamIdByName {

    my ($workstreamName) = @_;

    my $query = $dbConn->prepare("SELECT workstream_id FROM workstream WHERE name='".$workstreamName."'");
    $query->execute;
    
    while (my $row = $query->fetchrow_hashref) {
	return $row->{workstream_id}
    }
    
    return -1;
}


sub saveEvent {

    my ($class, $eventDetails) = @_;
    
    my $existingEvent = ();
    
    if (defined $eventDetails->{eventId} && length $eventDetails->{eventId} > 0) {
	$existingEvent = getEventDetails('', $eventDetails->{eventId});
    } else {
	undef $existingEvent;
    }
    
    if (length $eventDetails->{classname} == 0) {
	$eventDetails->{classname} = "other";
    }
    
    if (length $eventDetails->{workstreamId} == 0) {
	$eventDetails->{workstreamId} = 1;
    }
    
    $endDate = 'NULL';
    if (length $eventDetails->{endDate} > 0) {
	$endDate = "'".$eventDetails->{endDate}." 23:59:59'";
    }

    # ------------------------------------------------
    # DB Action
    # ------------------------------------------------    
    if (defined $existingEvent) {

	my $query = $dbConn->prepare("UPDATE event SET start_date='".$eventDetails->{startDate}."',
	    end_date=".$endDate.",
	    workstream_id='".$eventDetails->{workstreamId}."',
	    title='".$eventDetails->{title}."',
	    description='".$eventDetails->{description}."',
	    classname='".$eventDetails->{classname}."'
	    WHERE event_id = '".$eventDetails->{eventId}."'");
	    
	$query->execute;
	
    }
    else {
    
	# Make sure workstream is available
	if ($eventDetails->{workstreamId} == -1) {
	    
	    if ($eventDetails->{workstreamName} eq '') {
		return;
	    }
	    
	    $autoIncrementWs = "DEFAULT";
	    if ($dbEngine eq 'sqlite') {
		$autoIncrementWs = "(SELECT MAX(workstream_id) FROM workstream)+1";
	    }
	
	    $insertWorkstream = "INSERT INTO workstream (workstream_id, name, password) 
		VALUES(".$autoIncrementWs.", '".$eventDetails->{workstreamName}."', '".$eventDetails->{workstreamPassword}."')";
	    
	    my $queryWs = $dbConn->prepare($insertWorkstream);
	    $queryWs->execute;
	    
	    # Get workstream_id
	    $eventDetails->{workstreamId} = getWorkstreamIdByName($eventDetails->{workstreamName});
	    if ($eventDetails->{workstreamId} == -1) {
		return;
	    }
	}
    
	# Insert event into database
	$autoIncrement = "DEFAULT";
	if ($dbEngine eq 'sqlite') {
	    $autoIncrement = "(SELECT MAX(event_id) FROM event)+1";
	}
    
    	$command = "INSERT INTO event (
    		event_id, 
    		workstream_id, 
    		start_date, 
    		end_date, 
    		title, 
    		classname, 
    		description, 
    		is_active
    	    ) 
    	    VALUES (
    		".$autoIncrement.", 
    		'".$eventDetails->{workstreamId}."',
    		'".$eventDetails->{startDate}."',
	        ".$endDate.",
		'".$eventDetails->{title}."',
		'".$eventDetails->{classname}."',
		'".$eventDetails->{description}."',
		'Y'
	)";
	
	my $query = $dbConn->prepare($command);
	
	$query->execute;
    
    }
}

sub deleteEvent {

    my ($class, $eventDetails) = @_;

    my $query = $dbConn->prepare("DELETE FROM event WHERE event_id = '".$eventDetails->{eventId}."'");
    $query->execute;
}


1;
