package Timeline::TimelineEndpoint;
use Dancer ':syntax';
use Timeline::Storage::DBAccess;
use JSON;

our $VERSION = '0.1';

get '/' => sub {
    redirect '/ProjectPlan/web/index.html';
};

get '/ProjectPlan/' => sub {
    redirect '/ProjectPlan/web/index.html';
};

get '/ProjectPlan/web' => sub {
    redirect '/ProjectPlan/web/index.html';
};



# -------------------------------------------------------------------------
# XML: Get Timeline Entries - Web UI, Simile timeline
# -------------------------------------------------------------------------
get '/ProjectPlan/rest/service/timeline/:workstream/:searchpattern/:tags' => sub {

    # Preparing for XML output
    set layout => 'timeline-xml-data';
    content_type 'text/xml';
    
    my @entries = Timeline::Storage::DBAccess->getTimelineEntries(
	getParameter('workstream'), 
	getParameter('searchpattern'), 
	getParameter('tags'));
    
    # Assign output to Template & Display
    template 'timeline-xml-data', { 
	'entries' => \@entries,
	'something' => 'valami'
    };
};

# -------------------------------------------------------------------------
# JSON: Get All Event - mobile UI
# -------------------------------------------------------------------------
get '/ProjectPlan/rest/service/getAllEvent' => sub {

    content_type 'text/json';
    my @entries = Timeline::Storage::DBAccess->getAllTimelineEntries();
    
    my %result = ('eventDetails' => \@entries);
    return encode_json \%result;    
};

# -------------------------------------------------------------------------
# JSON: Get Workstreams - Web UI
# -------------------------------------------------------------------------
get '/ProjectPlan/rest/service/getAllWorkstream' => sub {

    content_type 'text/json';
    my @workstreams = Timeline::Storage::DBAccess->getAllWorkstream();
    
    my %result = ('workstream' => \@workstreams);
    return encode_json \%result;    
};


# -------------------------------------------------------------------------
# JSON: Get Timeline-Event Details - Web UI
# -------------------------------------------------------------------------
get '/ProjectPlan/rest/service/eventDetails/:eventId' => sub {
    	
    content_type 'text/json';
    	
    # Get Event details
    
    my $eventDetails = Timeline::Storage::DBAccess->getEventDetails(getParameter('eventId'));
    
    my %chartData = ('release' => 'a', 'remainingQaTaskData' => '0', 'remainingTaskData' => '0', 'scopeData' => '0');
    $eventDetails->{burndownChartData} = \%chartData;
    
    return encode_json $eventDetails;
};

# -------------------------------------------------------------------------
# JSON: Save Event - mobile
# -------------------------------------------------------------------------
post '/ProjectPlan/rest/service/saveEvent' => sub {
    	
    content_type 'text/json';
    
    my $eventDetails = decode_json request->body;
    Timeline::Storage::DBAccess->saveEvent($eventDetails);
    
    # Response
    return '{"code":"0"}';
};

# -------------------------------------------------------------------------
# JSON: Delete Event - mobile
# -------------------------------------------------------------------------
post '/ProjectPlan/rest/service/deleteEvent' => sub {
    	
    content_type 'text/json';
    	
    my $eventDetails = decode_json request->body;
    Timeline::Storage::DBAccess->deleteEvent($eventDetails);
    
    # Response
    return '{"code":"0"}';	
    
};


sub getParameter {
    
    my ($parameterName) = @_;
    return quotemeta param($parameterName);
}

true;
