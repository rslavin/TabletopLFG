<?php

namespace App\Http\Controllers;

use App\Utils\Helpers;
use App\Models\Game;
use App\Models\GameInventory;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class OrganizationController extends Controller {

    public function getOrg($org) {
        // if org, find it first to minimize queries
        if (is_numeric($org))
            $o = Organization::find($org);
        else
            $o = Organization::where('short_name', '=', $org)->first();

        if ($o)
            return response()->json(['organization' => $o]);
        return response()->json(['error' => 'NO_ORGANIZATION_FOUND'], 404);
    }

    public function getOrgs() {
        $orgs = Helpers::withOffsets(Organization::whereNotNull('short_name')->orderBy('name'))->get();
        if ($orgs)
            return response()->json(['organizations' => $orgs]);
        return response()->json(['error' => 'NO_ORGANIZATIONS_FOUND'], 404);
    }

}
